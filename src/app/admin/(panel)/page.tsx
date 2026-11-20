import Link from "next/link";
import { readContentFresh } from "@/lib/cms/content";
import { collectImageSrcs } from "@/lib/cms/fields";
import { PAGE_IDS, PAGES } from "@/lib/cms/registry";
import { collections, isDbConfigured } from "@/lib/db";
import { isImageKitConfigured } from "@/lib/imagekit";
import MigratePhotos from "./MigratePhotos";

export const dynamic = "force-dynamic";

async function stats() {
  const empty = { updated: {} as Record<string, Date | undefined>, media: 0, unread: 0, total: 0, local: 0, error: "" };
  if (!isDbConfigured()) return empty;
  try {
    const { content, media, enquiries } = await collections();
    const [docs, mediaCount, unread, total, pages] = await Promise.all([
      content.find({}, { projection: { updatedAt: 1 } }).toArray(),
      media.countDocuments(),
      enquiries.countDocuments({ read: false }),
      enquiries.countDocuments(),
      Promise.all(PAGE_IDS.map((id) => readContentFresh(id))),
    ]);
    const local = new Set<string>();
    pages.forEach((c) => collectImageSrcs(c).forEach((s) => s.startsWith("/") && local.add(s)));
    return {
      updated: Object.fromEntries(docs.map((d) => [d._id, d.updatedAt])),
      media: mediaCount,
      unread,
      total,
      local: local.size,
      error: "",
    };
  } catch (err) {
    return { ...empty, error: err instanceof Error ? err.message : "Could not reach the database" };
  }
}

const fmt = (d?: Date) =>
  d ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(d) : "Using built-in content";

export default async function Dashboard() {
  const s = await stats();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">Edit the words and photos on each page, manage photos and read enquiries.</p>
      </header>

      {s.error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">Database error: {s.error}</p>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Pages</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {PAGE_IDS.map((id) => (
            <Link
              key={id}
              href={`/admin/pages/${id}`}
              className="rounded-xl bg-white p-5 ring-1 ring-stone-200 transition hover:ring-stone-400"
            >
              <span className="block font-semibold">{PAGES[id].schema.title}</span>
              <span className="mt-1 block text-xs text-stone-500">{PAGES[id].schema.path}</span>
              <span className="mt-4 block text-xs text-stone-500">Last saved: {fmt(s.updated[id])}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/media" className="rounded-xl bg-white p-5 ring-1 ring-stone-200 hover:ring-stone-400">
          <span className="block text-3xl font-semibold">{s.media}</span>
          <span className="mt-1 block text-sm text-stone-500">Photos in the ImageKit library</span>
        </Link>
        <Link href="/admin/enquiries" className="rounded-xl bg-white p-5 ring-1 ring-stone-200 hover:ring-stone-400">
          <span className="block text-3xl font-semibold">
            {s.unread}
            <span className="text-base font-normal text-stone-400"> / {s.total}</span>
          </span>
          <span className="mt-1 block text-sm text-stone-500">Unread booking enquiries</span>
        </Link>
      </section>

      {isDbConfigured() && isImageKitConfigured() && s.local > 0 && (
        <section className="rounded-xl bg-white p-5 ring-1 ring-stone-200">
          <h2 className="font-semibold">Move built-in photos to ImageKit</h2>
          <p className="mt-1 text-sm text-stone-500">
            {s.local} photo{s.local === 1 ? " is" : "s are"} still served from the site&apos;s own files. Moving them
            uploads each one to ImageKit, adds it to the photo library and updates the pages to use it.
          </p>
          <MigratePhotos total={s.local} />
        </section>
      )}
    </div>
  );
}
