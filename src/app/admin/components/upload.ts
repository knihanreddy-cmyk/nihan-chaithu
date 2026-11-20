"use client";

import { getUploadAuth, recordUpload } from "../actions";
import type { MediaItem } from "../types";

const MAX_BYTES = 25 * 1024 * 1024;

/** Upload one photo straight from the browser to ImageKit (signed by the server), then record it in MongoDB. */
export async function uploadPhoto(file: File): Promise<MediaItem> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
  if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 25 MB.`);

  const auth = await getUploadAuth();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("fileName", file.name.replace(/[^\w.-]+/g, "-"));
  fd.append("publicKey", auth.publicKey);
  fd.append("signature", auth.signature);
  fd.append("expire", String(auth.expire));
  fd.append("token", auth.token);
  fd.append("folder", auth.folder);
  fd.append("useUniqueFileName", "true");

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: fd });
  const body = (await res.json().catch(() => ({}))) as { fileId?: string; message?: string };
  if (!res.ok || !body.fileId) throw new Error(body.message || `Upload failed (${res.status})`);
  return recordUpload(body.fileId);
}
