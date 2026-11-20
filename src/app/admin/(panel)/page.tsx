import Link from "next/link";
import { readContentFresh } from "@/lib/cms/content";
import { collectImageSrcs, type Img } from "@/lib/cms/fields";
import { PAGE_IDS, PAGES, type PageContentMap, type PageId } from "@/lib/cms/registry";
import { collections, isDbConfigured, type EnquiryDoc } from "@/lib/db";
import { isImageKitConfigured } from "@/lib/imagekit";
import { thumb } from "../types";
import MigratePhotos from "./MigratePhotos";

export const dynamic = "force-dynamic";

type Recent = EnquiryDoc & { id: string };

async function load() {
  const content = Object.fromEntries(PAGE_IDS.map((id) => [id, PAGES[id].defaults])) as PageContentMap;
  const base = {
    content,
    updated: {} as Partial<Record<PageId, Date>>,
    media: 0,
    unread: 0,
    total: 0,
    month: 0,
    recent: [] as Recent[],
    local: 0,
    error: "",
  };
  if (!isDbConfigured()) return base;
  try {
    const { content: contentCol, media, enquiries } = await collections();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [docs, mediaCount, unread, total, month, recent, pages] = await Promise.all([
      contentCol.find({}, { projection: { updatedAt: 1 } }).toArray(),
      media.countDocuments(),
      enquiries.countDocuments({ read: false }),
      enquiries.countDocuments(),
      enquiries.countDocuments({ createdAt: { $gte: monthStart } }),
      enquiries.find().sort({ createdAt: -1 }).limit(4).toArray(),
      Promise.all(PAGE_IDS.map(async (id) => [id, await readContentFresh(id)] as const)),
    ]);
    const local = new Set<string>();
    pages.forEach(([, c]) => collectImageSrcs(c).forEach((s) => s.startsWith("/") && local.add(s)));
    return {
      content: Object.fromEntries(pages) as PageContentMap,
      updated: Object.fromEntries(docs.map((d) => [d._id, d.updatedAt])) as Partial<Record<PageId, Date>>,
      media: mediaCount,
      unread,
      total,
      month,
      recent: recent.map((r) => ({ ...r, id: r._id.toString() })),
      local: local.size,
      error: "",
    };
  } catch (err) {
    return { ...base, error: err instanceof Error ? err.message : "Could not reach the database" };
  }
}

/* ------------------------------------------------------------------ helpers */

const TZ = "Asia/Kolkata";
const two = (n: number) => String(n).padStart(2, "0");

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: TZ }).format(new Date()));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function ago(d: Date) {
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.floor(m)} min ago`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)} h ago`;
  const days = h / 24;
  if (days < 2) return "yesterday";
  if (days < 7) return `${Math.floor(days)} d ago`;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: TZ }).format(d);
}

/** How each page appears in "In this issue": its cover, arch shape and name colour. */
const PAGE_LOOK: Record<PageId, { cover: (c: PageContentMap) => Img; shape: string; ink: string; blurb: string }> = {
  home: {
    cover: (c) => c.home.chaithrika.image,
    shape: "rounded-t-[160px] rounded-b-md",
    ink: "#1E1B18",
    blurb: "The two glass portals",
  },
  chaithrika: {
    cover: (c) => c.chaithrika.about.image,
    shape: "rounded-md",
    ink: "#9C3F5C",
    blurb: "Model & actress",
  },
  nihan: {
    cover: (c) => c.nihan.hero.image,
    shape: "rounded-t-md rounded-b-[160px]",
    ink: "#2F5D46",
    blurb: "Field-notes journal",
  },
};

function Figure({
  href,
  value,
  label,
  note,
  accent,
  first,
}: {
  href: string;
  value: number;
  label: string;
  note: string;
  accent?: boolean;
  first?: boolean;
}) {
  return (
    <Link href={href} className={`group block py-2 ${first ? "sm:pr-6" : "border-[#DDD3C6] sm:border-l sm:px-6"}`}>
      <span className={`block font-fraunces text-[72px] font-light leading-[.9] sm:text-[80px] ${accent ? "text-[#9C3F5C]" : ""}`}>
        {two(value)}
      </span>
      <span className="mt-2.5 block text-sm font-medium group-hover:underline group-hover:underline-offset-4">{label}</span>
      <span className="block text-[13px] text-[#6B635A]">{note}</span>
    </Link>
  );
}

/* --------------------------------------------------------------------- page */

export default async function Dashboard() {
  const s = await load();
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: TZ })
    .format(new Date())
    .replace(",", " ·")
    .toUpperCase();
  const saved = PAGE_IDS.filter((id) => s.updated[id]).length;

  return (
    <div className="flex flex-col gap-9">
      {/* Masthead */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1E1B18] pb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9C3F5C]">{today}</p>
          <h1 className="mt-2.5 font-fraunces text-5xl font-light leading-[.96] tracking-tight sm:text-[68px]">
            {greeting()}, <i className="text-[#9C3F5C]">welcome back.</i>
          </h1>
        </div>
        <Link
          href="/admin/media"
          className="inline-flex h-12.5 items-center gap-2.5 rounded-[14px] bg-[#1E1B18] px-5.5 text-sm font-semibold text-[#F5F0E8] hover:bg-[#3A3530]"
        >
          Upload photos
        </Link>
      </header>

      {s.error && (
        <p className="rounded-[14px] border border-[#E7C9D2] bg-[#9C3F5C]/6 p-4 text-sm text-[#7A2E47]">Database error: {s.error}</p>
      )}

      {/* Figures */}
      <section aria-label="Overview" className="grid gap-6 border-b border-[#DDD3C6] pb-7 sm:grid-cols-3 sm:gap-0">
        <Figure
          href="/admin/enquiries"
          value={s.unread}
          label="Unread enquiries"
          note={`${s.month} this month · ${s.total} in all`}
          accent
          first
        />
        <Figure href="/admin/media" value={s.media} label="Photographs" note="Stored in ImageKit" />
        <Figure href="/admin/pages/home" value={saved} label="Pages edited" note="Saved in the CMS, of 3" />
      </section>

      {/* In this issue */}
      <section aria-labelledby="issue-h">
        <h2 id="issue-h" className="text-xs font-semibold tracking-[0.2em]">
          IN THIS ISSUE
        </h2>
        <div className="mt-4.5 grid gap-6 sm:grid-cols-3">
          {PAGE_IDS.map((id, i) => {
            const look = PAGE_LOOK[id];
            const cover = look.cover(s.content);
            const when = s.updated[id];
            return (
              <Link key={id} href={`/admin/pages/${id}`} className="group block">
                <div className={`overflow-hidden ${look.shape}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(cover.src, 640)}
                    alt=""
                    className="block h-70 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: cover.position || "50% 22%" }}
                  />
                </div>
                <span className="mt-3.5 flex items-baseline justify-between">
                  <span
                    className="font-fraunces text-[28px] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4"
                    style={{ color: look.ink }}
                  >
                    {PAGES[id].schema.title}
                  </span>
                  <span className="text-xs text-[#6B635A]">p. {two(i + 1)}</span>
                </span>
                <span className="mt-1 block text-[13px] text-[#6B635A]">
                  {look.blurb} · {when ? `saved ${ago(when)}` : "original content"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Letters to the editor */}
      <section aria-labelledby="letters-h" className="border-t border-[#1E1B18] pt-5.5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="letters-h" className="font-fraunces text-[34px] font-light">
            Letters to the <i className="text-[#9C3F5C]">editor</i>
          </h2>
          <Link href="/admin/enquiries" className="shrink-0 text-[13px] font-medium text-[#9C3F5C] hover:text-[#6E2440]">
            All enquiries →
          </Link>
        </div>
        {s.recent.length === 0 ? (
          <p className="mt-4 border-y border-[#DDD3C6] py-8 text-center text-sm text-[#6B635A]">
            No letters yet. Messages from the booking forms will appear here.
          </p>
        ) : (
          <ul className="mt-3.5">
            {s.recent.map((e) => (
              <li key={e.id} className="border-b border-[#DDD3C6] last:border-b-0">
                <Link
                  href="/admin/enquiries"
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4.5 gap-y-1 py-4 hover:bg-[#1E1B18]/3 sm:grid-cols-[110px_minmax(0,1fr)_auto]"
                >
                  <span className={`text-xs font-semibold tracking-[0.12em] ${e.read ? "text-[#6B635A]" : "text-[#9C3F5C]"}`}>
                    {e.read ? "READ" : "● NEW"}
                  </span>
                  <span className="col-span-2 min-w-0 sm:col-span-1">
                    <span className="block truncate font-semibold">
                      {e.name}
                      {e.type ? ` · ${e.type}` : ""}
                    </span>
                    <span className="block truncate text-sm text-[#5A534B]">
                      For {e.page === "nihan" ? "Nihan" : "Chaithrika"}
                      {e.message ? ` — ${e.message}` : e.contact ? ` — ${e.contact}` : ""}
                    </span>
                  </span>
                  <span className="col-start-2 row-start-1 text-[13px] text-[#6B635A] sm:col-start-auto sm:row-start-auto">
                    {ago(e.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Photo storage */}
      {isDbConfigured() && isImageKitConfigured() && s.local > 0 && (
        <section className="flex flex-wrap items-center justify-between gap-5 rounded-[14px] border border-[#1E1B18] bg-[#FFFDF9] p-6 shadow-[6px_6px_0_#E7C9D2]">
          <div className="max-w-xl">
            <h2 className="font-fraunces text-2xl font-light">
              Move the archive to <i className="text-[#9C3F5C]">ImageKit</i>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5A534B]">
              {s.local} photograph{s.local === 1 ? " is" : "s are"}
              {" "}still served from the website&apos;s own files. Moving them puts every photo in the library and
              loads them from ImageKit&apos;s fast servers.
            </p>
          </div>
          <MigratePhotos total={s.local} />
        </section>
      )}
    </div>
  );
}
