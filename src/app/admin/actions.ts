"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ObjectId } from "mongodb";
import { revalidatePath, updateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { checkCredentials, createSessionToken, isAuthConfigured, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { CONTENT_TAG, readContentFresh } from "@/lib/cms/content";
import { collectImageSrcs, replaceImageSrcs, sanitizePage } from "@/lib/cms/fields";
import { isPageId, PAGE_IDS, PAGES } from "@/lib/cms/registry";
import { collections, isDbConfigured, type MediaDoc } from "@/lib/db";
import { deleteFile, getFileDetails, isImageKitConfigured, uploadAuthParams, uploadBuffer } from "@/lib/imagekit";
import type { MediaItem } from "./types";

/* ------------------------------------------------------------------ auth */

export async function login(_prev: { error: string } | null, formData: FormData): Promise<{ error: string }> {
  if (!isAuthConfigured()) return { error: "ADMIN_EMAIL and ADMIN_PASSWORD are not set on the server." };
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!(await checkCredentials(email, password))) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "That email or password is not right." };
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* --------------------------------------------------------------- content */

function refreshSite() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

function needDb() {
  if (!isDbConfigured()) throw new Error("MongoDB is not configured. Set MONGODB_URI in the environment.");
}

export async function saveContent(page: string, data: unknown): Promise<{ ok: true; savedAt: string } | { ok: false; error: string }> {
  await requireAdmin();
  if (!isPageId(page)) return { ok: false, error: "Unknown page" };
  try {
    needDb();
    const { schema, defaults } = PAGES[page];
    const clean = sanitizePage(schema, data, defaults);
    const { content } = await collections();
    const savedAt = new Date();
    await content.updateOne({ _id: page }, { $set: { data: clean, updatedAt: savedAt } }, { upsert: true });
    refreshSite();
    return { ok: true, savedAt: savedAt.toISOString() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save" };
  }
}

export async function resetContent(page: string): Promise<void> {
  await requireAdmin();
  if (!isPageId(page)) return;
  needDb();
  const { content } = await collections();
  await content.deleteOne({ _id: page });
  refreshSite();
  redirect(`/admin/pages/${page}?reset=1`);
}

/* ----------------------------------------------------------------- media */

const toItem = (m: MediaDoc): MediaItem => ({
  id: m._id,
  url: m.url,
  name: m.name,
  width: m.width,
  height: m.height,
  size: m.size,
  createdAt: m.createdAt.toISOString(),
});

export async function getUploadAuth() {
  await requireAdmin();
  if (!isImageKitConfigured()) throw new Error("ImageKit is not configured on the server.");
  return uploadAuthParams();
}

/** After the browser uploads to ImageKit, record the file. Details are re-read from ImageKit, not trusted from the browser. */
export async function recordUpload(fileId: string): Promise<MediaItem> {
  await requireAdmin();
  needDb();
  const f = await getFileDetails(fileId);
  const doc: MediaDoc = {
    _id: f.fileId,
    url: f.url,
    name: f.name,
    width: f.width ?? 1200,
    height: f.height ?? 1600,
    size: f.size ?? 0,
    createdAt: new Date(),
  };
  const { media } = await collections();
  await media.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });
  return toItem(doc);
}

export async function listMedia(): Promise<MediaItem[]> {
  await requireAdmin();
  if (!isDbConfigured()) return [];
  const { media } = await collections();
  const docs = await media.find().sort({ createdAt: -1 }).limit(1000).toArray();
  return docs.map(toItem);
}

/** Pages whose saved content uses this image URL. */
async function usagesOf(url: string): Promise<string[]> {
  const used: string[] = [];
  for (const page of PAGE_IDS) {
    const content = await readContentFresh(page);
    if (collectImageSrcs(content).has(url)) used.push(PAGES[page].schema.title);
  }
  return used;
}

export async function deleteMedia(fileId: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  needDb();
  const { media } = await collections();
  const doc = await media.findOne({ _id: fileId });
  if (!doc) return { ok: true };
  const used = await usagesOf(doc.url);
  if (used.length) return { ok: false, error: `Still used on: ${used.join(", ")}. Swap the photo there first.` };
  try {
    await deleteFile(fileId);
    await media.deleteOne({ _id: fileId });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete" };
  }
}

/**
 * Move the built-in photos (from /public) into ImageKit and point the content at them.
 * Works in small batches so each call stays short; the admin calls it until `remaining` is 0.
 */
export async function migrateLocalImages(): Promise<{ moved: number; remaining: number; errors: string[] }> {
  await requireAdmin();
  needDb();
  if (!isImageKitConfigured()) throw new Error("ImageKit is not configured on the server.");

  const pages = await Promise.all(PAGE_IDS.map(async (id) => [id, await readContentFresh(id)] as const));
  const local = new Set<string>();
  pages.forEach(([, c]) => collectImageSrcs(c).forEach((src) => src.startsWith("/") && local.add(src)));

  const { media, content } = await collections();
  const done = await media.find({ sourcePath: { $in: [...local] } }).toArray();
  const map = new Map(done.map((m) => [m.sourcePath as string, m.url]));
  const todo = [...local].filter((src) => !map.has(src));
  const batch = todo.slice(0, 4);
  const errors: string[] = [];

  const h = await headers();
  const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0].trim();
  const origin = `${proto}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const publicDir = path.join(process.cwd(), "public");

  for (const src of batch) {
    try {
      const rel = decodeURIComponent(src);
      const file = path.join(publicDir, rel);
      if (!file.startsWith(publicDir + path.sep)) throw new Error("outside public/");
      let bytes: Uint8Array;
      try {
        bytes = await readFile(file);
      } catch {
        // Hosted builds may not ship /public with the server code: fetch it from the site instead.
        const res = await fetch(new URL(src, origin));
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        bytes = new Uint8Array(await res.arrayBuffer());
      }
      const sub = path.posix.dirname(rel).replace(/^\/images\/?/, "");
      const folder = `${process.env.IMAGEKIT_FOLDER || "/portfolio"}${sub ? `/${sub}` : ""}`;
      const up = await uploadBuffer(bytes, path.posix.basename(rel), folder);
      await media.updateOne(
        { _id: up.fileId },
        {
          $setOnInsert: {
            _id: up.fileId,
            url: up.url,
            name: up.name,
            width: up.width ?? 1200,
            height: up.height ?? 1600,
            size: up.size ?? bytes.byteLength,
            sourcePath: src,
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );
      map.set(src, up.url);
    } catch (err) {
      errors.push(`${src}: ${err instanceof Error ? err.message : "failed"}`);
    }
  }

  // Point every page at the ImageKit copies moved so far.
  for (const [id, data] of pages) {
    const next = replaceImageSrcs(data, map);
    if (JSON.stringify(next) !== JSON.stringify(data)) {
      await content.updateOne({ _id: id }, { $set: { data: next, updatedAt: new Date() } }, { upsert: true });
    }
  }
  refreshSite();
  const failed = new Set(errors.map((e) => e.split(":")[0]));
  return { moved: batch.length - failed.size, remaining: todo.length - batch.length + failed.size, errors };
}

/* ------------------------------------------------------------- enquiries */

export async function setEnquiryRead(id: string, read: boolean) {
  await requireAdmin();
  needDb();
  if (!ObjectId.isValid(id)) return;
  const { enquiries } = await collections();
  await enquiries.updateOne({ _id: new ObjectId(id) }, { $set: { read } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  needDb();
  if (!ObjectId.isValid(id)) return;
  const { enquiries } = await collections();
  await enquiries.deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
