"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type Ref,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { designImage, usePageBackground, type DesignImageName } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original names. */
const c = (...names: (string | false | null | undefined)[]) =>
  names
    .map((n) => (n ? styles[n] : undefined))
    .filter(Boolean)
    .join(" ");

type Who = "c" | "n";

const HREF: Record<Who, string> = { c: "/chaithrika", n: "/nihan" };
const WORD: Record<Who, string> = { c: "CHAITHRIKA", n: "NIHAN" };
const FLOOD_MS = 850;
const FADE_MS = 260;
/** Extra time before we navigate anyway if the animation never reports finishing. */
const SAFETY_MS = 600;
const CARD_IMAGES: DesignImageName[] = ["floral-lehenga", "orange-flowers", "green-gown"];
const CARD_SIZES = "(max-width: 1058px) 180px, (max-width: 1470px) 17vw, 250px";

/* The cursor card only runs for a fine pointer that can hover (mouse / trackpad). */
const FINE_QUERY = "(hover: hover) and (pointer: fine)";
const subscribeFine = (cb: () => void) => {
  const mql = window.matchMedia(FINE_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getFine = () => window.matchMedia(FINE_QUERY).matches;
const getFineServer = () => false;

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clipOf(r: DOMRect) {
  const t = Math.max(0, r.top);
  const l = Math.max(0, r.left);
  const b = Math.max(0, window.innerHeight - r.bottom);
  const rt = Math.max(0, window.innerWidth - r.right);
  return `inset(${t}px ${rt}px ${b}px ${l}px)`;
}

function EnterArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** The giant name, split into masked letters (each letter rises in, thins on hover, spreads on exit). */
function Word({ text, wordRef }: { text: string; wordRef: Ref<HTMLSpanElement> }) {
  return (
    <span className={styles.word} ref={wordRef} aria-hidden="true">
      {[...text].map((ch, i) => (
        <span className={styles.l} data-l="" key={i}>
          <span className={styles.l__i} style={{ "--i": i } as CSSProperties}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Home9({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#EDEBE6");
  const router = useRouter();
  const fine = useSyncExternalStore(subscribeFine, getFine, getFineServer);

  const rowsRef = useRef<HTMLElement>(null);
  const rowCRef = useRef<HTMLAnchorElement>(null);
  const rowNRef = useRef<HTMLAnchorElement>(null);
  const wordCRef = useRef<HTMLSpanElement>(null);
  const wordNRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const busyRef = useRef(false);
  /* Cursor-card motion state (target, eased position, tilt), mutated outside React renders. */
  const motion = useRef({ tx: 0, ty: 0, x: 0, y: 0, rot: 0, raf: 0, shown: false });
  const kickRef = useRef<() => void>(() => {});

  const [hover, setHover] = useState<Who | "">("");
  const [card, setCard] = useState<{ on: boolean; who: Who }>({ on: false, who: "c" });
  const [slide, setSlide] = useState(0);
  const [chosen, setChosen] = useState<Who | null>(null);
  const [spread, setSpread] = useState(false);

  const rowRef = (who: Who) => (who === "c" ? rowCRef : rowNRef);

  /* Fit each name to the row width. Measures the rest (800/75%) and hover (300/100%) shapes and
     fits the wider, so the hover never overflows. Re-fits after web fonts load and on resize. */
  useEffect(() => {
    const measure = measureRef.current;
    const rows = rowsRef.current;
    if (!measure || !rows) return;
    const pairs = [
      { row: rowCRef.current, word: wordCRef.current, text: WORD.c },
      { row: rowNRef.current, word: wordNRef.current, text: WORD.n },
    ];

    const widthOf = (text: string, wght: number, wdth: number, fs: number) => {
      if (measure.dataset.text !== text) {
        measure.replaceChildren(
          ...[...text].map((ch) => {
            const s = document.createElement("span");
            s.textContent = ch;
            return s;
          }),
        );
        measure.dataset.text = text;
      }
      measure.style.fontSize = `${fs}px`;
      measure.style.fontWeight = String(wght);
      measure.style.fontStretch = `${wdth}%`;
      return measure.getBoundingClientRect().width;
    };
    /** Width of the word at 100px, measured at font size `fs` (optical sizing changes glyph widths). */
    const shapeAt = (text: string, fs: number) =>
      (Math.max(widthOf(text, 800, 75, fs), widthOf(text, 300, 100, fs)) / fs) * 100;

    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      pairs.forEach(({ row, word, text }) => {
        if (!row || !word) return;
        const avail = row.clientWidth;
        if (!avail) return;
        let mw = shapeAt(text, 100);
        let fs = (avail / mw) * 100 * 0.985;
        mw = shapeAt(text, fs);
        fs = (avail / mw) * 100 * 0.985;
        if (window.innerWidth > 760) fs = Math.min(fs, Math.max(window.innerHeight * 0.36, 120));
        word.style.fontSize = `${fs.toFixed(2)}px`;
        word.style.width = `${Math.min(avail, ((mw * fs) / 100) * 1.004).toFixed(1)}px`;
      });
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };

    fit();
    const fonts = document.fonts;
    if (fonts) {
      fonts.ready.then(fit);
      fonts.addEventListener("loadingdone", schedule);
    }
    window.addEventListener("resize", schedule);
    let lastWidth = -1;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w !== lastWidth) {
        lastWidth = w;
        schedule();
      }
    });
    ro.observe(rows);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      fonts?.removeEventListener("loadingdone", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  /* Cursor card: lerp towards the pointer with a velocity tilt. Fine pointers only. */
  useEffect(() => {
    if (!fine) return;
    const el = cardRef.current;
    if (!el) return;
    const reduce = prefersReduced();
    const m = motion.current;
    m.tx = m.x = window.innerWidth / 2;
    m.ty = m.y = window.innerHeight / 2;

    const tick = () => {
      const px = m.x;
      const k = reduce ? 1 : 0.14;
      m.x += (m.tx - m.x) * k;
      m.y += (m.ty - m.y) * k;
      const vx = m.x - px;
      const targetRot = reduce ? 0 : Math.max(-14, Math.min(14, vx * 0.7));
      m.rot += (targetRot - m.rot) * 0.18;
      el.style.transform = `translate3d(${m.x.toFixed(1)}px,${m.y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${m.rot.toFixed(2)}deg)`;
      if (Math.abs(m.tx - m.x) > 0.2 || Math.abs(m.ty - m.y) > 0.2 || Math.abs(m.rot) > 0.05)
        m.raf = requestAnimationFrame(tick);
      else m.raf = 0;
    };
    const kick = () => {
      if (!m.raf) m.raf = requestAnimationFrame(tick);
    };
    kickRef.current = kick;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      m.tx = e.clientX;
      m.ty = e.clientY;
      if (!m.shown) {
        m.x = m.tx;
        m.y = m.ty;
      }
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(m.raf);
      m.raf = 0;
      m.shown = false;
      kickRef.current = () => {};
    };
  }, [fine]);

  /* Chaithrika's card cycles through three photos while it is showing. */
  const cycling = fine && card.on && card.who === "c";
  useEffect(() => {
    if (!cycling || prefersReduced()) return;
    const id = window.setInterval(() => setSlide((n) => (n + 1) % CARD_IMAGES.length), 700);
    return () => window.clearInterval(id);
  }, [cycling]);

  const showCard = (who: Who) => {
    motion.current.shown = true;
    setSlide(0);
    setCard({ on: true, who });
    kickRef.current();
  };
  const hideCard = () => {
    motion.current.shown = false;
    setCard((s) => (s.on ? { ...s, on: false } : s));
  };

  /* If the page is restored from the back/forward cache mid-transition, put it back to rest. */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      [rowCRef.current, rowNRef.current].forEach((row) =>
        row?.querySelectorAll<HTMLElement>("[data-l]").forEach((l) => (l.style.transform = "")),
      );
      busyRef.current = false;
      rectRef.current = null;
      setSpread(false);
      setChosen(null);
      setHover("");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  /* Exit: the letters spread apart while an orange flood grows from the row to the full screen. */
  const floodRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!chosen) return;
    const flood = floodRef.current;
    const row = (chosen === "c" ? rowCRef : rowNRef).current;
    const r = rectRef.current;
    if (!flood || !row || !r) return;

    const reduce = prefersReduced();
    let raf = 0;
    let anim: Animation;
    if (reduce) {
      anim = flood.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_MS, fill: "forwards" });
    } else {
      const ls = Array.from(row.querySelectorAll<HTMLElement>("[data-l]"));
      const mid = (ls.length - 1) / 2;
      const step = window.innerWidth * (ls.length > 6 ? 0.07 : 0.13);
      raf = requestAnimationFrame(() => {
        setSpread(true);
        ls.forEach((l, i) => {
          l.style.transform = `translateX(${((i - mid) * step).toFixed(1)}px)`;
        });
      });
      anim = flood.animate([{ clipPath: clipOf(r) }, { clipPath: "inset(0px 0px 0px 0px)" }], {
        duration: FLOOD_MS,
        easing: "cubic-bezier(.76,0,.24,1)",
        fill: "forwards",
      });
    }

    let done = false;
    const navigate = () => {
      if (done) return;
      done = true;
      router.push(HREF[chosen]);
    };
    anim.finished.then(navigate, () => {});
    const safety = window.setTimeout(navigate, (reduce ? FADE_MS : FLOOD_MS) + SAFETY_MS);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      anim.cancel();
    };
  }, [chosen, router]);

  /* Plain clicks (and Enter) only — Link skips onNavigate for modified/middle clicks. */
  const choose = (who: Who, e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (busyRef.current) return;
    const row = rowRef(who).current;
    if (!row) {
      router.push(HREF[who]);
      return;
    }
    busyRef.current = true;
    hideCard();
    setHover("");
    rectRef.current = row.getBoundingClientRect();
    setChosen(who);
  };

  const whoOf = (el: HTMLElement): Who => (el.dataset.who === "n" ? "n" : "c");
  const onEnter = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (busyRef.current || e.pointerType !== "mouse" || !getFine()) return;
    const who = whoOf(e.currentTarget);
    setHover(who);
    const m = motion.current;
    m.tx = e.clientX;
    m.ty = e.clientY;
    if (!m.shown) {
      m.x = m.tx;
      m.y = m.ty;
    }
    showCard(who);
  };
  const onLeave = () => {
    if (busyRef.current) return;
    setHover("");
    hideCard();
  };
  const onFocusRow = (e: ReactFocusEvent<HTMLAnchorElement>) => {
    if (!busyRef.current) setHover(whoOf(e.currentTarget));
  };
  const onBlurRow = () => {
    if (!busyRef.current) setHover("");
  };

  const rowClass = (who: Who) =>
    c("row", who === "c" ? "row--c" : "row--n", chosen === who && "is-chosen", chosen === who && spread && "spread");

  return (
    <div className={`${c("root", chosen && "leaving")} ${fontClassName}`}>
      <div className={styles.page}>
        <header className={styles.top}>
          <Link className={styles.mark} href="/" aria-label="Chaithrika and Nihan, home">
            <b>
              C<span>&amp;</span>N
            </b>
            <i>Chaithrika &amp; Nihan</i>
          </Link>
          <span className={styles.top__r}>Pick a portfolio</span>
        </header>

        <main className={styles.main}>
          <nav className={styles.rows} ref={rowsRef} aria-label="Choose a portfolio" data-hover={hover || undefined}>
            <Link
              className={rowClass("c")}
              href={HREF.c}
              ref={rowCRef}
              style={{ "--r": 0 } as CSSProperties}
              aria-label="Chaithrika, model and actress. Enter her portfolio"
              data-who="c"
              onNavigate={(e) => choose("c", e)}
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
              onFocus={onFocusRow}
              onBlur={onBlurRow}
            >
              <span className={styles.row__meta}>
                <span className={styles.idx}>01</span>
                <span className={styles.cap}>model &amp; actress</span>
                <span className={styles.disc}>Runway &middot; Editorial &middot; Commercial &middot; Acting</span>
                <span className={styles.spacer} />
                <span className={styles.row__thumb}>
                  <Image {...designImage("floral-lehenga")} alt="" sizes="44px" />
                </span>
                <span className={styles.enter}>
                  <span className={styles.enter__t}>Enter</span>
                  <EnterArrow />
                </span>
              </span>
              <Word text={WORD.c} wordRef={wordCRef} />
            </Link>

            <Link
              className={rowClass("n")}
              href={HREF.n}
              ref={rowNRef}
              style={{ "--r": 1 } as CSSProperties}
              aria-label="Nihan, portfolio. Enter Nihan's world"
              data-who="n"
              onNavigate={(e) => choose("n", e)}
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
              onFocus={onFocusRow}
              onBlur={onBlurRow}
            >
              <span className={styles.row__meta}>
                <span className={styles.idx}>02</span>
                <span className={styles.cap}>portfolio</span>
                <span className={styles.disc}>New faces, fresh frames</span>
                <span className={styles.spacer} />
                <span className={styles.row__thumb}>
                  {/* Replace with <Image {...designImage("nihan")} … /> when Nihan's photos are ready */}
                  <span className={c("portrait--placeholder")} data-swap="nihan">
                    <span className={styles.ph__n}>N</span>
                  </span>
                </span>
                <span className={styles.enter}>
                  <span className={styles.enter__t}>Enter</span>
                  <EnterArrow />
                </span>
              </span>
              <Word text={WORD.n} wordRef={wordNRef} />
            </Link>
          </nav>
        </main>

        <footer className={styles.foot}>
          <span>Bookings managed by their parents</span>
          <span className={styles.foot__r}>
            <span className={styles.foot__opt}>Home option 09 of 10 &mdash; Big Type Hover Reveal</span>
            <Link className={styles.foot__link} href="/home-page-designs">
              All home designs
            </Link>
          </span>
        </footer>
      </div>

      {fine && (
        <div
          className={c("cursor-card", card.on && "is-on")}
          ref={cardRef}
          data-who={card.who}
          aria-hidden="true"
        >
          <div className={styles["cursor-card__in"]}>
            <div className={c("cc", "cc--c")}>
              {CARD_IMAGES.map((name, i) => (
                <Image
                  key={name}
                  {...designImage(name)}
                  alt=""
                  sizes={CARD_SIZES}
                  loading="eager"
                  className={i === slide ? styles["is-shown"] : undefined}
                />
              ))}
              <span className={styles.cc__tag}>IKFW &middot; S11</span>
            </div>
            <div className={c("cc", "cc--n")}>
              {/* Replace with <Image {...designImage("nihan")} … /> when Nihan's photos are ready */}
              <div className={c("portrait--placeholder")} data-swap="nihan">
                <span className={styles.ph__n}>N</span>
                <span className={styles.ph__cap}>Portrait coming soon</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.flood} ref={floodRef} hidden={!chosen} />
      <span className={styles.measure} ref={measureRef} aria-hidden="true" />
    </div>
  );
}
