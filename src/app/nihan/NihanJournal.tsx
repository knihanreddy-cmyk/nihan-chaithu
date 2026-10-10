"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent, type Ref } from "react";
import { usePageBackground } from "@/components/designs/shared";
import { nihanPhoto, type NihanPhotoNo } from "./photos";
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

const THANKS = "Thank you! Online enquiries aren't connected yet — please contact his parents directly.";

type Tape = "" | "g" | "b";

const LOOKS: { cls: string; no: NihanPhotoNo; tape: Tape; alt: string; cap: string; small: string }[] = [
  {
    cls: "lk-b",
    no: 28,
    tape: "g",
    alt: "Nihan in a striped navy and white sweater against a yellow wall",
    cap: "Striped knit, 2026",
    small: "Look 02",
  },
  {
    cls: "lk-c",
    no: 26,
    tape: "b",
    alt: "Festive close portrait of Nihan in a gold shawl and pearl necklaces with a tilak",
    cap: "Festive look, 2023",
    small: "Look 03",
  },
  {
    cls: "lk-d",
    no: 20,
    tape: "",
    alt: "Nihan in a lime-green kurta, white trousers and sunglasses in a garden",
    cap: "Garden kurta, 2019",
    small: "Look 04",
  },
  {
    cls: "lk-e",
    no: 15,
    tape: "g",
    alt: "Young Nihan dressed as little Krishna in a yellow dhoti and red scarf against a white wall",
    cap: "Little Krishna, 2019",
    small: "Look 05",
  },
];

type Stop = {
  no: NihanPhotoNo;
  tape: Tape;
  portrait: boolean;
  alt: string;
  cap: string;
  date: string;
  title: string;
  text: string;
  hand?: string;
};

const STOPS: Stop[] = [
  { no: 19, tape: "", portrait: true, alt: "Baby Nihan looking at a phone, close-up", cap: "The first page", date: "Sep 2015", title: "Day one of the journal", text: "The earliest photo in the collection, already curious about the camera." },
  { no: 1, tape: "g", portrait: false, alt: "Baby Nihan in a striped tee sitting beside a giant bottle gourd", cap: "Who's bigger?", date: "Jan 2016", title: "Vegetable for scale", text: "A striped tee and a bottle gourd almost as tall as him." },
  { no: 3, tape: "b", portrait: false, alt: "Toddler Nihan at the steering wheel of a big red tractor", cap: "Driver's seat", date: "Sep 2017", title: "Big red tractor", text: "Hands on the wheel of the largest vehicle in the album.", hand: "first expedition vehicle" },
  { no: 12, tape: "", portrait: true, alt: "Nihan standing next to a giant cartoon statue in a park", cap: "Park giants", date: "Jun 2018", title: "Park of statues", text: "A day out among giant figures, three pages from the same trip." },
  { no: 13, tape: "g", portrait: false, alt: "Nihan riding a crocodile statue in a park", cap: "Crocodile ride", date: "Jun 2018", title: "Crocodile, tamed", text: "Same park, a braver seat.", hand: "no crocodiles were harmed" },
  { no: 14, tape: "b", portrait: true, alt: "Nihan digging soil with a hoe", cap: "Ground work", date: "Jun 2018", title: "Digging in", text: "Hoe in hand, working the soil." },
  { no: 16, tape: "", portrait: true, alt: "Nihan standing in a flooded paddy field holding rice saplings", cap: "Monsoon planting", date: "Jul 2020", title: "Paddy field, monsoon", text: "Ankle-deep in water with a bundle of rice saplings." },
  { no: 21, tape: "g", portrait: true, alt: "Nihan in a yellow tee standing with his bicycle on a street", cap: "Two wheels", date: "Jul 2022", title: "On his own bicycle", text: "A yellow tee and a bike of his own for the street." },
  { no: 5, tape: "b", portrait: true, alt: "Nihan walking on the beach in a striped tee and sunglasses with waves behind", cap: "Beach walk", date: "Undated page", title: "Along the waterline", text: "Striped tee, sunglasses and the waves for company." },
  { no: 25, tape: "", portrait: false, alt: "Nihan by the sea in a checked shirt and sunglasses under a cloudy sky", cap: "Seaside, 2023", date: "Aug 2023", title: "Seaside, cinematic", text: "Checked shirt, dark glasses and a sky full of weather." },
  { no: 27, tape: "g", portrait: false, alt: "Nihan smiling in a blue polo in front of an ornate temple", cap: "Temple visit", date: "Apr 2025", title: "Temple steps", text: "A big smile in front of carved stone.", hand: "latest stop, more to come" },
];

type Cat = "looks" | "adv" | "little";
type Filter = "all" | Cat;

const FILTERS: { f: Filter; label: string }[] = [
  { f: "all", label: "All" },
  { f: "looks", label: "Looks" },
  { f: "adv", label: "Adventures" },
  { f: "little", label: "Little moments" },
];

const TAG_LABEL: Record<Cat, string> = { looks: "Looks", adv: "Adventure", little: "Little" };

const ENTRIES: { c: Cat; no: NihanPhotoNo; tape: Tape; alt: string; cap: string }[] = [
  { c: "looks", no: 6, tape: "", alt: "Studio portrait in a navy embroidered kurta and sunglasses", cap: "Studio, navy kurta" },
  { c: "adv", no: 3, tape: "b", alt: "Toddler driving a big red tractor", cap: "Tractor, 2017" },
  { c: "little", no: 11, tape: "g", alt: "Baby studio shot on a black backdrop with a finger on his lip", cap: "Shh, studio baby" },
  { c: "looks", no: 26, tape: "b", alt: "Festive portrait with gold shawl, pearl necklaces and tilak", cap: "Festive look, 2023" },
  { c: "adv", no: 16, tape: "", alt: "Standing in a flooded paddy field with rice saplings", cap: "Paddy field, 2020" },
  { c: "little", no: 2, tape: "", alt: "Toddler in sunglasses sitting on a car bonnet", cap: "Cool already, 2017" },
  { c: "adv", no: 25, tape: "g", alt: "By the sea under a dramatic cloudy sky", cap: "Seaside, 2023" },
  { c: "looks", no: 28, tape: "g", alt: "Striped navy and white sweater against a yellow wall", cap: "Yellow wall, 2026" },
  { c: "little", no: 19, tape: "b", alt: "Baby looking at a phone, close-up", cap: "First photo, 2015" },
  { c: "adv", no: 13, tape: "", alt: "Riding a crocodile statue in a park", cap: "Croc ride, 2018" },
  { c: "looks", no: 22, tape: "b", alt: "At night among fairy lights in a yellow hoodie, holding a small light", cap: "Fairy lights, 2023" },
  { c: "little", no: 24, tape: "g", alt: "Holding a green and white umbrella in a yellow tee", cap: "Umbrella day, 2023" },
  { c: "adv", no: 21, tape: "b", alt: "With his bicycle on a street in a yellow tee", cap: "Cycling, 2022" },
  { c: "looks", no: 20, tape: "", alt: "Lime-green kurta with white trousers and sunglasses in a garden", cap: "Garden kurta, 2019" },
  { c: "little", no: 1, tape: "", alt: "Baby beside a giant bottle gourd", cap: "Bottle gourd, 2016" },
  { c: "adv", no: 27, tape: "g", alt: "Smiling in a blue polo in front of an ornate temple", cap: "Temple, 2025" },
];

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

export default function NihanJournal({ fontClassName }: { fontClassName: string }) {
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
    setThanks(THANKS);
    e.currentTarget.reset();
  };

  const shown = ENTRIES.filter((en) => filter === "all" || en.c === filter).length;

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
            <a className={styles.ticket} href="#contact">
              Book Nihan
            </a>
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
          <a className={c("ticket", "ticket-wide")} href="#contact" onClick={(e) => onDrawerLink(e, "contact")}>
            Book Nihan
          </a>
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
              <span className={c("cover-label", "kicker")}>Portfolio &middot; Vol. 1</span>
              <h1 id="hero-title">
                The Adventures <em>of Nihan</em>
              </h1>
              <p className={styles.lead}>New faces, fresh frames. Style, story and a lot of sunshine.</p>
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
              <span className={styles["hero-note"]} aria-hidden="true">
                best view yet!
              </span>
              <figure className={styles.tp}>
                <span className={tapeClass("", "c1")} />
                <span className={tapeClass("b", "c2")} />
                <Image
                  {...nihanPhoto(25)}
                  alt="Nihan by the sea in a checked shirt and sunglasses under a cloudy, dramatic sky"
                  sizes="(max-width: 860px) calc(100vw - 40px), (max-width: 1220px) 52vw, 610px"
                  preload
                />
                <figcaption>
                  Seaside, Aug 2023<small>Field page 01</small>
                </figcaption>
              </figure>
              <div className={styles.stamp} aria-hidden="true">
                Field notes<span>Nihan Reddy</span>2015&ndash;2026
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className={styles.intro} aria-label="Introduction">
          <div className={c("wrap", "rv")}>
            <span className={styles.hand}>First entry &mdash;</span>
            <p>
              From a curious baby in 2015 to a sharp-dressed boy in 2026: tractors, paddy fields, seasides and temple
              steps. These pages keep his looks, his places and the little moments in between.
            </p>
          </div>
        </section>

        {/* LOOKS */}
        <section className={c("sec", "looks")} id="looks" aria-labelledby="looks-title">
          <div className={styles.wrap}>
            <div className={c("sec-head", "rv")}>
              <div>
                <span className={styles.pageno}>p. 02</span>
                <h2 id="looks-title">Packing list: Looks</h2>
              </div>
              <p>Five outfits worth taking on any trip, from studio kurta to festive gold.</p>
            </div>
            <div className={styles["looks-layout"]}>
              <aside className={c("pack", "rv")} aria-label="Outfit checklist">
                <h3>Outfits packed</h3>
                <ul>
                  <li>Navy embroidered kurta</li>
                  <li>Lime-green kurta, 2019</li>
                  <li>Festive gold shawl, 2023</li>
                  <li>Striped sweater, 2026</li>
                  <li>Little-Krishna costume</li>
                </ul>
                <p className={styles.foot}>Sunglasses come along every time.</p>
              </aside>
              <div className={styles["looks-grid"]}>
                <figure className={c("tp", "lk-a", "rv")}>
                  <span className={styles.tape} />
                  <div className={styles.imgbox}>
                    <Image
                      src={nihanPhoto(6).src}
                      fill
                      alt="Studio portrait of Nihan in a navy embroidered kurta and sunglasses against a grey backdrop"
                      sizes="(max-width: 640px) calc(100vw - 60px), (max-width: 980px) 38vw, 320px"
                    />
                  </div>
                  <figcaption>
                    Navy kurta, studio<small>Look 01</small>
                  </figcaption>
                </figure>
                {LOOKS.map((lk) => (
                  <figure key={lk.cls} className={c("tp", lk.cls, "rv")}>
                    <span className={tapeClass(lk.tape)} />
                    <Image
                      {...nihanPhoto(lk.no)}
                      alt={lk.alt}
                      sizes="(max-width: 640px) 44vw, (max-width: 980px) 29vw, 250px"
                    />
                    <figcaption>
                      {lk.cap}
                      <small>{lk.small}</small>
                    </figcaption>
                  </figure>
                ))}
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
                <h2 id="story-title">The route so far</h2>
              </div>
              <p>Growing up in frames: every stop on the map, in the order it happened.</p>
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

              {STOPS.map((s, i) => (
                <article key={s.no} className={c("stop", i % 2 === 1 && "flip", "rv")}>
                  <figure className={c("tp", s.portrait && "p")}>
                    <span className={tapeClass(s.tape)} />
                    <Image
                      {...nihanPhoto(s.no)}
                      alt={s.alt}
                      sizes={
                        s.portrait
                          ? "(max-width: 720px) 62vw, 330px"
                          : "(max-width: 720px) 80vw, (max-width: 1220px) 45vw, 550px"
                      }
                    />
                    <figcaption>{s.cap}</figcaption>
                  </figure>
                  <div className={styles.note}>
                    <span className={styles.date}>{s.date}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    {s.hand && <span className={styles.hand}>{s.hand}</span>}
                  </div>
                </article>
              ))}
            </div>
            <p className={styles["route-end"]}>&hellip; to be continued</p>
          </div>
        </section>

        {/* GALLERY */}
        <section className={styles.sec} id="gallery" aria-labelledby="gallery-title" style={{ paddingTop: 0 }}>
          <div className={styles.wrap}>
            <div className={c("sec-head", "rv")}>
              <div>
                <span className={styles.pageno}>p. 04</span>
                <h2 id="gallery-title">Logged entries</h2>
              </div>
              <p>Every page, stamped and sorted. Pick a stamp to filter.</p>
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
                <div key={i} className={styles.entry} hidden={!(filter === "all" || en.c === filter)}>
                  <figure className={styles.tp}>
                    <span className={tapeClass(en.tape)} />
                    <Image
                      {...nihanPhoto(en.no)}
                      alt={en.alt}
                      sizes="(max-width: 900px) 46vw, (max-width: 1220px) 30vw, 375px"
                    />
                    <figcaption>{en.cap}</figcaption>
                  </figure>
                  <div className={styles.meta}>
                    <span className={styles.no}>No. {String(i + 1).padStart(2, "0")}</span>
                    <span className={c("tag", `tag-${en.c}`)}>{TAG_LABEL[en.c]}</span>
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
              <Image
                {...nihanPhoto(23)}
                alt="Nihan with his sister Chaithrika, both carrying school-style bags"
                sizes="(max-width: 800px) 90vw, 420px"
              />
              <figcaption>With Chaithrika, Jun 2023</figcaption>
            </figure>
            <div className={styles.rv}>
              <span className={styles.kicker}>Expedition partner</span>
              <h2 id="sib-title" style={{ marginTop: 12 }}>
                Every explorer needs a co-pilot.
              </h2>
              <span className={styles["hand-big"]}>bags packed, ready to go</span>
              <p>His sister Chaithrika is a child model and actress, and the other half of this family portfolio.</p>
              <div className={styles.btns} style={{ marginTop: 24 }}>
                <Link className={styles.btn} href="/chaithrika">
                  Meet his sister Chaithrika &rarr;
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
              <h2 id="contact-title">Send a note</h2>
              <p style={{ marginTop: 16 }}>
                For shoots, campaigns and collaborations. Bookings are managed by his parents, who will reply
                personally.
              </p>
              <span className={styles.hand}>&mdash; replies come by post (well, email)</span>
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
                <button className={styles.btn} type="submit">
                  Post the note &rarr;
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
          <span>Bookings managed by his parents &middot; &copy; Nihan Reddy</span>
        </div>
      </footer>
    </div>
  );
}

