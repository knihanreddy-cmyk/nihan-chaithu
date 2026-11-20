import { ArrowUpRight, Clock, Images, Inbox, Pencil, Sparkles, type LucideIcon } from "lucide-react";
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
    recent: [] as Recent[],
    local: 0,
    error: "",
  };
  if (!isDbConfigured()) return base;
  try {
    const { content: contentCol, media, enquiries } = await collections();
    const [docs, mediaCount, unread, total, recent, pages] = await Promise.all([
      contentCol.find({}, { projection: { updatedAt: 1 } }).toArray(),
      media.countDocuments(),
      enquiries.countDocuments({ read: false }),
      enquiries.countDocuments(),
      enquiries.find().sort({ createdAt: -1 }).limit(5).toArray(),
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
  if (days < 7) return `${Math.floor(days)} d ago`;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: TZ }).format(d);
}

/** How each page appears on the dashboard: its cover photo and accent. */
const PAGE_LOOK: Record<PageId, { cover: (c: PageContentMap) => Img; tint: string; ink: string; blurb: string }> = {
  home: {
    cover: (c) => c.home.chaithrika.image,
    tint: "#E9DDF0",
    ink: "#6B4C7A",
    blurb: "The two glass portals",
  },
  chaithrika: {
    cover: (c) => c.chaithrika.about.image,
    tint: "#F6C9D8",
    ink: "#B8456E",
    blurb: "Model & actress portfolio",
  },
  nihan: {
    cover: (c) => c.nihan.hero.image,
    tint: "#D7E8DC",
    ink: "#2F5D46",
    blurb: "Field-notes journal",
  },
};

const glass =
  "rounded-[26px] border border-white/70 bg-white/60 shadow-[0_24px_60px_-40px_rgba(42,27,46,.55)] backdrop-blur-xl";

function Stat({
  href,
  icon: Icon,
  value,
  suffix,
  label,
  accent,
}: {
  href: string;
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  accent: string;
}) {
  return (
    <Link href={href} className={`${glass} group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:bg-white/80`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${accent}22`, color: accent }}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-3xl font-semibold leading-none tracking-tight tabular-nums">
          {value}
          {suffix && <span className="ml-1 text-sm font-normal text-[#2A1B2E]/40">{suffix}</span>}
        </span>
        <span className="mt-1.5 block text-sm text-[#2A1B2E]/60">{label}</span>
      </span>
      <ArrowUpRight
        className="ml-auto h-4 w-4 shrink-0 text-[#2A1B2E]/30 transition group-hover:text-[#2A1B2E]"
        aria-hidden="true"
      />
    </Link>
  );
}

/* --------------------------------------------------------------------- page */

export default async function Dashboard() {
  const s = await load();
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(new Date());
  const published = PAGE_IDS.filter((id) => s.updated[id]).length;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A1B2E]/45">{today}</p>
          <h1 className="mt-2 font-playfair text-4xl leading-[1.05] sm:text-5xl">
            {greeting()}, <em className="text-[#D9577F]">welcome back</em>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-[#2A1B2E]/60">
            Everything on the family portfolio in one place: the pages, the photos and the people who want to book.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 rounded-full border border-[#2A1B2E]/15 bg-white/70 px-5 py-2.5 text-sm font-semibold hover:bg-white"
          >
            <Images className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Upload photos
          </Link>
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-[#2A1B2E] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(42,27,46,.8)] hover:bg-[#3B2741]"
          >
            View website
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </header>

      {s.error && (
        <p className="rounded-2xl bg-[#D9577F]/10 p-4 text-sm text-[#9E2F52] ring-1 ring-[#D9577F]/20">Database error: {s.error}</p>
      )}

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Overview">
        <Stat href="/admin/enquiries" icon={Inbox} value={s.unread} suffix={`/ ${s.total}`} label="Unread enquiries" accent="#D9577F" />
        <Stat href="/admin/media" icon={Images} value={s.media} label="Photos in ImageKit" accent="#3E8F86" />
        <Stat href="/admin/pages/home" icon={Sparkles} value={published} suffix="/ 3" label="Pages edited in the CMS" accent="#8A5BA0" />
      </section>

      {/* Pages */}
      <section aria-labelledby="pages-h">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="pages-h" className="font-playfair text-2xl">
            Your <em className="text-[#D9577F]">pages</em>
          </h2>
          <span className="hidden text-sm text-[#2A1B2E]/50 sm:inline">Click a page to edit its words and photos</span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PAGE_IDS.map((id) => {
            const look = PAGE_LOOK[id];
            const cover = look.cover(s.content);
            const { title, path } = PAGES[id].schema;
            const when = s.updated[id];
            return (
              <article key={id} className={`${glass} group relative overflow-hidden p-2.5`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]" style={{ background: look.tint }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(cover.src, 640)}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    style={{ objectPosition: cover.position || "50% 25%" }}
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
                    {path}
                  </span>
                </div>
                <div className="px-3 pb-3 pt-4">
                  <h3 className="font-playfair text-2xl leading-tight" style={{ color: look.ink }}>
                    {title}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#2A1B2E]/55">{look.blurb}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-[#2A1B2E]/50">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                    {when ? `Saved ${ago(when)}` : "Showing the original content"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/pages/${id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2A1B2E] px-4 py-2.5 text-sm font-semibold text-white after:absolute after:inset-0 after:content-[''] hover:bg-[#3B2741]"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                      Edit page
                    </Link>
                    <a
                      href={path}
                      target="_blank"
                      className="relative z-10 inline-flex items-center justify-center rounded-full border border-[#2A1B2E]/15 bg-white/70 px-3.5 text-[#2A1B2E]/70 hover:bg-white hover:text-[#2A1B2E]"
                      aria-label={`View ${title} on the website`}
                    >
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent enquiries */}
        <section className={`${glass} p-6`} aria-labelledby="recent-h">
          <div className="flex items-baseline justify-between">
            <h2 id="recent-h" className="font-playfair text-2xl">
              Recent <em className="text-[#D9577F]">enquiries</em>
            </h2>
            <Link href="/admin/enquiries" className="text-sm font-medium text-[#2A1B2E]/60 hover:text-[#2A1B2E]">
              View all →
            </Link>
          </div>
          {s.recent.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#2A1B2E]/15 p-8 text-center">
              <Inbox className="mx-auto h-7 w-7 text-[#2A1B2E]/30" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-3 text-sm text-[#2A1B2E]/55">
                No enquiries yet. Messages from the booking forms will appear here.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-[#2A1B2E]/8">
              {s.recent.map((e) => (
                <li key={e.id}>
                  <Link href="/admin/enquiries" className="-mx-3 flex items-start gap-3 rounded-2xl px-3 py-3 hover:bg-white/70">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-playfair text-base text-white"
                      style={{ background: e.page === "nihan" ? "#2F5D46" : "#D9577F" }}
                      aria-hidden="true"
                    >
                      {e.name.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{e.name}</span>
                        {!e.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#D9577F]" aria-label="Unread" />}
                        <span className="ml-auto shrink-0 text-xs text-[#2A1B2E]/45">{ago(e.createdAt)}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-[#2A1B2E]/60">
                        {e.type ? `${e.type} · ` : ""}
                        {e.message || e.contact}
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2A1B2E]/40">
                        For {e.page === "nihan" ? "Nihan" : "Chaithrika"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Photo storage */}
        <section className={`${glass} flex flex-col p-6`} aria-labelledby="photos-h">
          <h2 id="photos-h" className="font-playfair text-2xl">
            Photo <em className="text-[#D9577F]">storage</em>
          </h2>
          {isDbConfigured() && isImageKitConfigured() && s.local > 0 ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-[#2A1B2E]/60">
                {s.local} photo{s.local === 1 ? " is" : "s are"}{" "}still served from the website&apos;s own files. Move
                them to ImageKit so every photo lives in the library and loads from its fast image servers.
              </p>
              <div className="mt-auto pt-2">
                <MigratePhotos total={s.local} />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-[#2A1B2E]/60">
                {isImageKitConfigured()
                  ? "All photos on the pages are stored in ImageKit. Upload new ones and pick them in any page editor."
                  : "ImageKit isn't connected yet. Add the ImageKit keys to .env to upload photos."}
              </p>
              <div className="mt-auto flex items-center gap-3 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#3E8F86]/15 text-[#3E8F86]">
                  <Images className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <Link href="/admin/media" className="text-sm font-semibold hover:underline">
                  Open the photo library →
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
