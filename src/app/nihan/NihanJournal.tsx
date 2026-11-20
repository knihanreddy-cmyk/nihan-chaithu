"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, useTransition, type FormEvent, type MouseEvent, type Ref } from "react";
import { usePageBackground } from "@/components/designs/shared";
import { submitEnquiry } from "@/app/actions/enquiry";
import { nihanDefaults, type NihanCat, type NihanContent, type Tape } from "@/lib/cms/pages/nihan";
import { imgProps, rich } from "@/lib/cms/render";
import styles from "./nihan.module.css";

/** Join CSS-module class names (template names kept), skipping falsy entries. */
const c = (...names: (string | false | null | undefined)[]) =>
  names
    .filter((n): n is string => Boolean(n))
    .map((n) => styles[n])
    .join(" ");

const REDUCE_Q = "(prefers-reduced-motion: reduce)";
const DESKTOP_Q = "(min-width: 900px)";

const noopSubscribe = () => () => {};
/** false during SSR and hydration, true once the client has taken over. */
const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
const subscribeReduce = (cb: () => void) => {
  const mql = window.matchMedia(REDUCE_Q);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_Q).matches,
    () => false,
  );

const SECTIONS = [
  { id: "looks", label: "Looks" },
  { id: "story", label: "Story" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

/** Layout slots of the looks collage, in order. The first is the large framed photo. */
const LOOK_SLOTS = ["lk-a", "lk-b", "lk-c", "lk-d", "lk-e"] as const;

type Filter = "all" | NihanCat;

const FILTERS: { f: Filter; label: string }[] = [
  { f: "all", label: "All" },
  { f: "looks", label: "Looks" },
  { f: "adv", label: "Adventures" },
  { f: "little", label: "Little moments" },
];

const TAG_LABEL: Record<NihanCat, string> = { looks: "Looks", adv: "Adventure", little: "Little" };

const tapeClass = (tape: Tape, ...extra: string[]) => c("tape", tape || null, ...extra);

function Compass({ needleRef }: { needleRef: Ref<SVGGElement> }) {
  return (
    <svg className={styles.compass} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#FBF8F0" stroke="#1E2A24" strokeWidth="2" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#1E2A24" strokeWidth=".8" strokeDasharray="1.5 2.2" />
      <text
        x="20"
        y="9.4"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="700"
        fill="#1E2A24"
        style={{ fontFamily: "var(--slab)" }}
      >
        N
      </text>
      <g ref={needleRef} className={styles.needle}>
        <path d="M20 8 L23 20 L20 22 L17 20 Z" fill="#2F5D46" />
        <path d="M20 32 L23 20 L20 18 L17 20 Z" fill="#D9A62E" />
        <circle cx="20" cy="20" r="1.6" fill="#1E2A24" />
      </g>
    </svg>
  );
}

export default function NihanJournal({
  fontClassName,
  content = nihanDefaults,
}: {
  fontClassName: string;
  /** Editable copy and photos from the CMS. */
  content?: NihanContent;
}) {
  const { hero, intro, looks, story, gallery, sibling, contact, footer } = content;
  const ENTRIES = gallery.entries;
  const [sending, startSending] = useTransition();
  usePageBackground("#EFE6D2");

  const rootRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const hlRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const routeSvgRef = useRef<SVGSVGElement>(null);
  const routeLineRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);

  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();
  /* Reveals only hide content once the client has hydrated, so SSR/no-JS content stays visible. */
  const ready = hydrated && !reduceMotion && typeof IntersectionObserver !== "undefined";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [thanks, setThanks] = useState("");

  /* Respect reduced motion for in-page anchor scrolling (the root layout sets smooth scrolling on <html>). */
  useEffect(() => {
    if (!window.matchMedia(REDUCE_Q).matches) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  /* Reveals: content is visible in the server HTML; hiding only starts once .ready is applied. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.setAttribute("data-in", "");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    root.querySelectorAll(`.${styles.rv}:not([data-in])`).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);

  /* Header: condensed state, dashed progress line, compass needle — one rAF-throttled scroll handler. */
  useEffect(() => {
    const reduce = window.matchMedia(REDUCE_Q).matches;
    let raf = 0;
    let last = false;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (!reduce && needleRef.current) needleRef.current.style.transform = `rotate(${((y * 0.25) % 360).toFixed(1)}deg)`;
      const s = y > 24;
      if (s !== last) {
        last = s;
        setScrolled(s);
      }
      // The last section can be too short to reach the spy band, so pin it at the very bottom.
      if (max > 0 && y >= max - 2) setActive("contact");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Scroll-spy: a thin band across the middle of the viewport decides the current section. */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) inBand.add(en.target.id);
          else inBand.delete(en.target.id);
        });
        const current = SECTIONS.filter((s) => inBand.has(s.id)).pop();
        if (current) {
          setActive(current.id);
        } else if (els[0].getBoundingClientRect().top > window.innerHeight * 0.45) {
          // Above the first section (the hero): nothing is current.
          setActive(null);
        }
        // Otherwise we're between tracked sections (e.g. the siblings band): keep the last one.
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Slide the shared highlighter bar to the active tab (transform only). */
  useEffect(() => {
    const bar = hlRef.current;
    if (!bar) return;
    let hidden = bar.style.opacity !== "1";
    const place = () => {
      const i = active ? SECTIONS.findIndex((s) => s.id === active) : -1;
      const link = i >= 0 ? tabRefs.current[i] : null;
      if (!link || !link.offsetWidth) {
        bar.style.opacity = "0";
        hidden = true;
        return;
      }
      const inset = 7;
      const x = link.offsetLeft + inset;
      const w = Math.max(10, link.offsetWidth - inset * 2);
      const t = `translateX(${x}px) skewX(-12deg) scaleX(${(w / 100).toFixed(4)})`;
      if (hidden) {
        // Appear in place instead of flying in from the previous position.
        bar.style.transition = "none";
        bar.style.transform = t;
        void bar.offsetWidth;
        bar.style.transition = "";
        hidden = false;
      } else {
        bar.style.transform = t;
      }
      bar.style.opacity = "1";
    };
    place();
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) place();
    });
    window.addEventListener("resize", place);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", place);
    };
  }, [active]);

  /* Mobile drawer: lock scroll, Escape closes (focus back to burger), widening to desktop closes. */
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const mq = window.matchMedia(DESKTOP_Q);
    const onMq = () => {
      if (mq.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      html.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [menuOpen]);

  /* Route line: drawn through the centre of each stop's photo, revealed with scroll. */
  useEffect(() => {
    const route = routeRef.current;
    const svg = routeSvgRef.current;
    const line = routeLineRef.current;
    const mpath = maskPathRef.current;
    if (!route || !svg || !line || !mpath) return;
    const reduce = window.matchMedia(REDUCE_Q).matches;
    let len = 0;

    const draw = () => {
      if (!len) return;
      const r = route.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      mpath.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
    };

    const build = () => {
      const box = route.getBoundingClientRect();
      const w = route.offsetWidth;
      const h = route.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      const pts: [number, number][] = [];
      route.querySelectorAll(`.${styles.stop} .${styles.tp} img`).forEach((img) => {
        const r = img.getBoundingClientRect();
        pts.push([r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]);
      });
      if (pts.length < 2) return;
      let d = `M${pts[0][0].toFixed(1)} ${Math.max(0, pts[0][1] - 200).toFixed(1)} L${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dy = (b[1] - a[1]) * 0.55;
        d += ` C${a[0].toFixed(1)} ${(a[1] + dy).toFixed(1)} ${b[0].toFixed(1)} ${(b[1] - dy).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
      }
      const lastPt = pts[pts.length - 1];
      d += ` L${lastPt[0].toFixed(1)} ${(h + 30).toFixed(1)}`;
      line.setAttribute("d", d);
      mpath.setAttribute("d", d);
      len = mpath.getTotalLength();
      mpath.style.strokeDasharray = `${len} ${len}`;
      draw();
    };

    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
        });
    };
    let rt: ReturnType<typeof setTimeout> | undefined;
    const rebuild = () => {
      clearTimeout(rt);
      rt = setTimeout(build, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", rebuild);
    window.addEventListener("load", rebuild);
    const ro = new ResizeObserver(rebuild);
    ro.observe(route);
    const imgs = Array.from(route.querySelectorAll("img"));
    imgs.forEach((im) => {
      if (!im.complete) im.addEventListener("load", rebuild);
    });
    // Reveal transforms shift the photos slightly; rebuild once they've settled.
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && (e.target as Element).classList.contains(styles.stop)) rebuild();
    };
    route.addEventListener("transitionend", onTransitionEnd);
    build();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("load", rebuild);
      ro.disconnect();
      imgs.forEach((im) => im.removeEventListener("load", rebuild));
      route.removeEventListener("transitionend", onTransitionEnd);
    };
  }, []);

  const onDrawerLink = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Close first, then scroll once the scroll lock is released.
    e.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const reduce = window.matchMedia(REDUCE_Q).matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startSending(async () => {
      const res = await submitEnquiry("nihan", data);
      setThanks(res.message);
      if (res.ok) form.reset();
    });
  };

  const shown = ENTRIES.filter((en) => filter === "all" || en.category === filter).length;

  const rootClass = [styles.root, ready ? styles.ready : "", fontClassName].filter(Boolean).join(" ");

  return (
    <div ref={rootRef} className={rootClass} id="top">
      {/* ===================== expedition header ===================== */}
      <header className={c("top", scrolled && "scrolled", menuOpen && "menu-open")}>
        <div className={c("wrap", "top-in")}>
          <a className={styles.brand} href="#top" aria-label="Nihan Reddy, back to top">
            <Compass needleRef={needleRef} />
            <span className={styles.label} aria-hidden="true">
              <span>Nihan</span>
              <span className={styles["wm-last"]}>Reddy</span>
            </span>
            <span className={styles["label-note"]} aria-hidden="true">
              field notes
            </span>
          </a>

          <nav className={styles.tabs} aria-label="Sections">
            <span ref={hlRef} className={styles.hl} aria-hidden="true" />
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className={styles.tab}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className={styles.right}>
            <nav className={styles.family} aria-label="Family">
              <Link className={styles.fam} href="/">
                Home ↗
              </Link>
              <span className={styles.vrule} aria-hidden="true" />
              <Link className={styles.fam} href="/chaithrika">
                Chaithrika ↗
              </Link>
            </nav>
          </div>

          <button
            ref={burgerRef}
            className={styles.burger}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="nihan-drawer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <span ref={progressRef} className={styles.progress} aria-hidden="true" />
      </header>

      {/* Notebook-page drawer (mobile). Outside the header so the header's backdrop-filter can't trap position: fixed. */}
      <div id="nihan-drawer" className={c("drawer", menuOpen && "open")} inert={!menuOpen}>
        <p className={styles["drawer-head"]} aria-hidden="true">
          Contents —
        </p>
        <nav aria-label="Menu">
          <ul className={styles["drawer-list"]}>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  className={styles["drawer-link"]}
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  onClick={(e) => onDrawerLink(e, s.id)}
                >
                  <span className={styles["drawer-word"]}>{s.label}</span>
                  <span className={styles["drawer-pg"]} aria-hidden="true">
                    p. {i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className={styles["drawer-family"]}>
            <Link className={styles.fam} href="/" onClick={() => setMenuOpen(false)}>
              Home ↗
            </Link>
            <span className={styles.vrule} aria-hidden="true" />
            <Link className={styles.fam} href="/chaithrika" onClick={() => setMenuOpen(false)}>
              Chaithrika ↗
            </Link>
          </div>
        </nav>
      </div>

      <main>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.wrap}>
            <div>
              <span className={c("cover-label", "kicker")}>{hero.kicker}</span>
              <h1 id="hero-title">{rich(hero.title)}</h1>
              <p className={styles.lead}>{hero.lead}</p>
              <div className={styles.btns}>
                <a className={styles.btn} href="#looks">
                  Open the journal &rarr;
                </a>
                <a className={c("btn", "ghost")} href="#contact">
                  Send a note
                </a>
              </div>
            </div>
            <div className={styles["hero-photo"]}>
              {hero.note && (
                <span className={styles["hero-note"]} aria-hidden="true">
                  {hero.note}
                </span>
              )}
              <figure className={styles.tp}>
                <span className={tapeClass("", "c1")} />
                <span className={tapeClass("b", "c2")} />
                <Image
                  {...imgProps(hero.image)} alt={hero.image.alt}
                  sizes="(max-width: 860px) calc(100vw - 40px), (max-width: 1220px) 52vw, 610px"
                  preload
                />
                <figcaption>
                  {hero.caption}
                  {hero.captionSmall && <small>{hero.captionSmall}</small>}
                </figcaption>
              </figure>
              <div className={styles.stamp} aria-hidden="true">
                Field notes<span>Nihan Reddy</span>
                {hero.stampYears}
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className={styles.intro} aria-label="Introduction">
          <div className={c("wrap", "rv")}>
            <span className={styles.hand}>{intro.hand}</span>
            <p>{intro.text}</p>
          </div>
        </section>

        {/* LOOKS */}
        <section className={c("sec", "looks")} id="looks" aria-labelledby="looks-title">
          <div className={styles.wrap}>
            <div className={c("sec-head", "rv")}>
              <div>
                <span className={styles.pageno}>p. 02</span>
                <h2 id="looks-title">{looks.heading}</h2>
              </div>
              <p>{looks.intro}</p>
            </div>
            <div className={styles["looks-layout"]}>
              <aside className={c("pack", "rv")} aria-label="Outfit checklist">
                <h3>{looks.packTitle}</h3>
                <ul>
                  {looks.packList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {looks.packFoot && <p className={styles.foot}>{looks.packFoot}</p>}
              </aside>
              <div className={styles["looks-grid"]}>
                {looks.items.slice(0, LOOK_SLOTS.length).map((lk, i) =>
                  i === 0 ? (
                    <figure key={i} className={c("tp", LOOK_SLOTS[i], "rv")}>
                      <span className={tapeClass(lk.tape)} />
                      <div className={styles.imgbox}>
                        <Image
                          src={lk.image.src}
                          fill
                          alt={lk.image.alt}
                          style={lk.image.position ? { objectPosition: lk.image.position } : undefined}
                          sizes="(max-width: 640px) calc(100vw - 60px), (max-width: 980px) 38vw, 320px"
                        />
                      </div>
                      <figcaption>
                        {lk.caption}
                        {lk.small && <small>{lk.small}</small>}
                      </figcaption>
                    </figure>
                  ) : (
                    <figure key={i} className={c("tp", LOOK_SLOTS[i], "rv")}>
                      <span className={tapeClass(lk.tape)} />
                      <Image
                        {...imgProps(lk.image)} alt={lk.image.alt}
                        sizes="(max-width: 640px) 44vw, (max-width: 980px) 29vw, 250px"
                      />
                      <figcaption>
                        {lk.caption}
                        {lk.small && <small>{lk.small}</small>}
                      </figcaption>
                    </figure>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* STORY / ROUTE */}
        <section className={styles.sec} id="story" aria-labelledby="story-title">
          <div className={styles.wrap}>
            <div className={c("sec-head", "rv")}>
              <div>
                <span className={styles.pageno}>p. 03</span>
                <h2 id="story-title">{story.heading}</h2>
              </div>
              <p>{story.intro}</p>
            </div>
            <p className={styles["route-start"]} aria-hidden="true">
              Start here &darr;
            </p>
            <div ref={routeRef} className={styles.route}>
              <svg ref={routeSvgRef} className={styles["route-svg"]} aria-hidden="true">
                <defs>
                  <mask id="nihan-route-mask" maskUnits="userSpaceOnUse">
                    <path ref={maskPathRef} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
                  </mask>
                </defs>
                <path
                  ref={routeLineRef}
                  fill="none"
                  stroke="#2F5D46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="1 11"
                  mask="url(#nihan-route-mask)"
                />
              </svg>

              {story.stops.map((s, i) => {
                const portrait = s.image.height > s.image.width;
                return (
                <article key={i} className={c("stop", i % 2 === 1 && "flip", "rv")}>
                  <figure className={c("tp", portrait && "p")}>
                    <span className={tapeClass(s.tape)} />
                    <Image
                      {...imgProps(s.image)} alt={s.image.alt}
                      sizes={
                        portrait
                          ? "(max-width: 720px) 62vw, 330px"
                          : "(max-width: 720px) 80vw, (max-width: 1220px) 45vw, 550px"
                      }
                    />
                    <figcaption>{s.caption}</figcaption>
                  </figure>
                  <div className={styles.note}>
                    <span className={styles.date}>{s.date}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    {s.hand && <span className={styles.hand}>{s.hand}</span>}
                  </div>
                </article>
                );
              })}
            </div>
            <p className={styles["route-end"]}>{story.end}</p>
          </div>
        </section>

        {/* GALLERY */}
        <section className={styles.sec} id="gallery" aria-labelledby="gallery-title" style={{ paddingTop: 0 }}>
          <div className={styles.wrap}>
            <div className={c("sec-head", "rv")}>
              <div>
                <span className={styles.pageno}>p. 04</span>
                <h2 id="gallery-title">{gallery.heading}</h2>
              </div>
              <p>{gallery.intro}</p>
            </div>
            <div className={styles.chips} role="group" aria-label="Filter gallery">
              {FILTERS.map((ch) => (
                <button
                  key={ch.f}
                  className={styles.chip}
                  type="button"
                  aria-pressed={filter === ch.f}
                  onClick={() => setFilter(ch.f)}
                >
                  {ch.label}
                </button>
              ))}
            </div>
            <p className={styles.count} aria-live="polite">
              {shown} {shown === 1 ? "entry" : "entries"}
            </p>
            <div className={styles.entries}>
              {ENTRIES.map((en, i) => (
                <div key={i} className={styles.entry} hidden={!(filter === "all" || en.category === filter)}>
                  <figure className={styles.tp}>
                    <span className={tapeClass(en.tape)} />
                    <Image
                      {...imgProps(en.image)} alt={en.image.alt}
                      sizes="(max-width: 900px) 46vw, (max-width: 1220px) 30vw, 375px"
                    />
                    <figcaption>{en.caption}</figcaption>
                  </figure>
                  <div className={styles.meta}>
                    <span className={styles.no}>No. {String(i + 1).padStart(2, "0")}</span>
                    <span className={c("tag", `tag-${en.category}`)}>{TAG_LABEL[en.category]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SIBLINGS */}
        <section className={c("sec", "sib")} aria-labelledby="sib-title">
          <div className={styles.wrap}>
            <figure className={c("tp", "rv")}>
              <span className={tapeClass("", "c1")} />
              <span className={tapeClass("g", "c2")} />
              <Image {...imgProps(sibling.image)} alt={sibling.image.alt} sizes="(max-width: 800px) 90vw, 420px" />
              <figcaption>{sibling.caption}</figcaption>
            </figure>
            <div className={styles.rv}>
              <span className={styles.kicker}>{sibling.kicker}</span>
              <h2 id="sib-title" style={{ marginTop: 12 }}>
                {sibling.heading}
              </h2>
              {sibling.hand && <span className={styles["hand-big"]}>{sibling.hand}</span>}
              <p>{sibling.text}</p>
              <div className={styles.btns} style={{ marginTop: 24 }}>
                <Link className={styles.btn} href="/chaithrika">
                  {sibling.button}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className={c("sec", "contact")} id="contact" aria-labelledby="contact-title">
          <div className={styles.wrap}>
            <div className={c("side", "rv")}>
              <span className={styles.pageno}>p. 05</span>
              <h2 id="contact-title">{contact.heading}</h2>
              <p style={{ marginTop: 16 }}>{contact.text}</p>
              {contact.hand && <span className={styles.hand}>{contact.hand}</span>}
            </div>
            <div className={c("letter", "rv")}>
              <span className={tapeClass("b")} />
              <form noValidate onSubmit={onSubmit}>
                <div className={styles.field}>
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-contact">Email or phone</label>
                  <input id="f-contact" name="contact" type="text" autoComplete="email" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-msg">Message</label>
                  <textarea id="f-msg" name="message" rows={4} />
                </div>
                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
                />
                <button className={styles.btn} type="submit" disabled={sending}>
                  {sending ? "Posting…" : "Post the note →"}
                </button>
                <p className={styles.thanks} role="status">
                  {thanks}
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles["site-foot"]}>
        <div className={styles.wrap}>
          <span className={styles.fb}>
            Nihan <span className={styles["fb-last"]}>Reddy</span>
          </span>
          <nav aria-label="Footer">
            <Link href="/">Home</Link>
            <Link href="/chaithrika">Chaithrika</Link>
            <a href="#looks">Looks</a>
            <a href="#story">Story</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </nav>
          <span>{footer.copyright}</span>
        </div>
      </footer>
    </div>
  );
}

