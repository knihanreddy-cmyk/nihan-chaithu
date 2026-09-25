"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: (string | false)[]) =>
  names
    .filter((n): n is string => Boolean(n))
    .map((n) => styles[n])
    .join(" ");

const PLAYERS = [
  { name: "Chaithrika", acc: "#FF6F91", path: "/chaithrika", key: "c" },
  { name: "Nihan", acc: "#2EC4B6", path: "/nihan", key: "n" },
] as const;

const SAFETY_MS = 2200;

type Going = { i: number; cx: number; cy: number; R: number; reduce: boolean };

export default function Home8({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#12121A");

  const router = useRouter();
  const stageRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const plRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wipeRef = useRef<HTMLDivElement>(null);
  const wipeInRef = useRef<HTMLDivElement>(null);

  const [sel, setSel] = useState(0);
  const selRef = useRef(0);
  const busyRef = useRef(false);
  const lastPointer = useRef("mouse");
  const downAt = useRef(0);
  const reduceRef = useRef(false);
  const [going, setGoing] = useState<Going | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceRef.current = mq.matches;
    const onChange = () => {
      reduceRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Move the selection ring over the selected frame. */
  const place = useCallback(() => {
    const f = frameRefs.current[selRef.current];
    const ring = ringRef.current;
    if (!f || !ring) return;
    const s = 1.03;
    const pad = window.innerWidth <= 640 ? 5 : 8;
    const w = f.offsetWidth * s;
    const h = f.offsetHeight * s;
    const x = f.offsetLeft - (w - f.offsetWidth) / 2 - pad;
    const y = f.offsetTop - (h - f.offsetHeight) / 2 - pad;
    ring.style.width = `${w + pad * 2}px`;
    ring.style.height = `${h + pad * 2}px`;
    ring.style.transform = `translate(${x}px,${y}px)`;
    ring.setAttribute("data-placed", "");
  }, []);

  useLayoutEffect(() => {
    place();
  }, [sel, place]);

  /* Re-place after fonts/layout settle and whenever the stage changes size. */
  useEffect(() => {
    let cancelled = false;
    const safePlace = () => {
      if (!cancelled) place();
    };
    window.addEventListener("resize", safePlace);
    window.addEventListener("load", safePlace);
    document.fonts?.ready.then(safePlace);
    const stage = stageRef.current;
    const ro = stage ? new ResizeObserver(safePlace) : null;
    if (stage) ro?.observe(stage);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", safePlace);
      window.removeEventListener("load", safePlace);
      ro?.disconnect();
    };
  }, [place]);

  const select = useCallback((i: number) => {
    if (busyRef.current || i === selRef.current) return;
    selRef.current = i;
    setSel(i);
  }, []);

  const open = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const i = selRef.current;
    const f = frameRefs.current[i];
    const r = f?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const cx = r ? r.left + r.width / 2 : vw / 2;
    const cy = r ? r.top + r.height / 2 : vh / 2;
    const R = Math.ceil(Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy))) + 20;
    setGoing({ i, cx, cy, R, reduce: reduceRef.current });
  }, []);

  /* Put the page back in its resting state (used when restored from the back/forward cache). */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      busyRef.current = false;
      setGoing(null);
      place();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [place]);

  /* Keyboard: ←/→ or A/D select, Enter opens. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (busyRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      const stage = stageRef.current;
      const focusInStage = !!stage && stage.contains(document.activeElement);
      if (k === "ArrowLeft" || k === "a" || k === "A") {
        e.preventDefault();
        select(0);
        if (focusInStage) plRefs.current[0]?.focus();
      } else if (k === "ArrowRight" || k === "d" || k === "D") {
        e.preventDefault();
        select(1);
        if (focusInStage) plRefs.current[1]?.focus();
      } else if (k === "Enter") {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "A" || t.tagName === "BUTTON")) return; // native activation handles it
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [select, open]);

  const onPlayerClick = (i: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab / window / download) behave natively.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busyRef.current) return;
    // Touch / pen: the first tap selects, a second tap on the selected player opens.
    if (i !== selRef.current && lastPointer.current !== "mouse") {
      select(i);
      lastPointer.current = "mouse";
      return;
    }
    lastPointer.current = "mouse";
    select(i);
    open();
  };

  /* Zoom the chosen frame, wipe the accent colour out from it, reveal the name, then navigate. */
  useLayoutEffect(() => {
    if (!going) return;
    const wipe = wipeRef.current;
    const wipeIn = wipeInRef.current;
    if (!wipe || !wipeIn) return;
    const { cx, cy, R } = going;
    const path = PLAYERS[going.i].path;
    const reduce = going.reduce;

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      router.push(path);
    };
    const timer = window.setTimeout(go, SAFETY_MS);
    const anims: Animation[] = [];
    const fail = () => {
      /* cancelled (unmount or reset) */
    };

    wipeIn.style.opacity = "0";
    if (reduce) {
      wipe.style.clipPath = "none";
      const a = wipe.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "forwards" });
      anims.push(a);
      a.finished.then(() => {
        wipeIn.style.opacity = "1";
        go();
      }, fail);
    } else {
      const from = `circle(0px at ${cx}px ${cy}px)`;
      const to = `circle(${R}px at ${cx}px ${cy}px)`;
      wipe.style.clipPath = from;
      const a = wipe.animate([{ clipPath: from }, { clipPath: from, offset: 0.3 }, { clipPath: to }], {
        duration: 1000,
        easing: "cubic-bezier(.65,0,.35,1)",
        fill: "forwards",
      });
      anims.push(a);
      a.finished.then(() => {
        if (done) return;
        wipe.style.clipPath = "none";
        const b = wipeIn.animate([{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], {
          duration: 420,
          easing: "cubic-bezier(.34,1.56,.64,1)",
          fill: "forwards",
        });
        anims.push(b);
        b.finished.then(go, fail);
      }, fail);
    }

    return () => {
      done = true;
      window.clearTimeout(timer);
      anims.forEach((a) => a.cancel());
    };
  }, [going, router]);

  const cur = PLAYERS[sel];
  const zoomIdx = going && !going.reduce ? going.i : -1;
  const zooming = zoomIdx >= 0;

  return (
    <div
      className={`${c("root", zooming && "zoom")} ${fontClassName}`}
      style={{ "--acc": cur.acc } as CSSProperties}
    >
      <header className={styles.top}>
        <Link className={styles.mark} href="/" aria-label="Chaithrika and Nihan, home">
          <i>C</i>
          <b>&amp;</b>
          <i>N</i>
        </Link>
        <span className={styles.top__tag}>Family portfolio &middot; India</span>
      </header>

      <main>
        <section className={styles.head} aria-labelledby="h8-hl">
          <p className={styles.kick}>
            Player select &middot; <span>{cur.name}</span>
          </p>
          <h1 id="h8-hl" className={styles.title}>
            Choose your <em>player</em>
          </h1>
        </section>

        <nav className={styles.stage} ref={stageRef} aria-label="Choose a portfolio">
          {PLAYERS.map((p, i) => {
            const isSel = i === sel;
            const isZoom = i === zoomIdx;
            return (
              <div
                key={p.key}
                className={c("slot", `slot--${p.key}`, isSel && "is-sel", isZoom && "is-zoom")}
              >
                <Link
                  ref={(el) => {
                    plRefs.current[i] = el;
                  }}
                  className={c("pl", isSel && "is-sel", isZoom && "is-zoom")}
                  href={p.path}
                  prefetch
                  aria-describedby={`h8-st${i}`}
                  onPointerDown={(e) => {
                    lastPointer.current = e.pointerType || "mouse";
                    downAt.current = Date.now();
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") select(i);
                  }}
                  onFocus={() => {
                    if (Date.now() - downAt.current > 700) select(i);
                  }}
                  onClick={onPlayerClick(i)}
                >
                  <div
                    className={c("frame", `frame--${p.key}`)}
                    ref={(el) => {
                      frameRefs.current[i] = el;
                    }}
                  >
                    <span className={styles.dots} aria-hidden="true" />
                    <span className={styles.floor} aria-hidden="true" />
                    {p.key === "c" ? (
                      <Image
                        {...designImage("runway-cutout")}
                        className={styles.fig}
                        alt="Chaithrika on the runway at India Kids Fashion Week"
                        sizes="(max-width: 640px) 36vw, 260px"
                        preload
                      />
                    ) : (
                      /* Replace with <Image {...designImage("nihan")} … /> when Nihan's photos are ready */
                      <div
                        className={styles.placeholder}
                        data-swap="nihan"
                        role="img"
                        aria-label="Nihan, portrait coming soon"
                      >
                        <span className={styles.ph__cap}>Portrait coming soon</span>
                        <p className={styles.ph__n} aria-hidden="true">
                          N
                        </p>
                      </div>
                    )}
                    <div className={styles.plate}>
                      <span className={styles.tag}>P{i + 1}</span>
                      <span className={styles.nm}>{p.name}</span>
                    </div>
                  </div>
                </Link>
                <div className={styles.stats} id={`h8-st${i}`}>
                  {p.key === "c" ? (
                    <dl>
                      <div>
                        <dt>Class</dt>
                        <dd>Model &amp; Actress</dd>
                      </div>
                      <div>
                        <dt>Skills</dt>
                        <dd>Runway &middot; Editorial &middot; Commercial &middot; Acting</dd>
                      </div>
                      <div>
                        <dt>Last walk</dt>
                        <dd>IKFW S11</dd>
                      </div>
                    </dl>
                  ) : (
                    <dl>
                      <div>
                        <dt>Portfolio</dt>
                        <dd>Coming soon</dd>
                      </div>
                      <div>
                        <dt>Motto</dt>
                        <dd>New faces, fresh frames</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>
            );
          })}

          <div className={c("ring", zooming && "is-hidden")} ref={ringRef} aria-hidden="true">
            <div className={styles.cursor}>
              <b>P{sel + 1} SELECTED</b>
              <i />
            </div>
          </div>
        </nav>

        <div className={styles.prompt}>
          <p className={c("press", "fine-only")}>
            Press Enter to open <span>{cur.name}</span>
          </p>
          <p className={c("press", "touch-only")}>
            Tap the glowing player to open <span>{cur.name}</span>
          </p>
          <p className={c("keys", "fine-only")}>
            <span>
              <kbd>&larr;</kbd>
              <kbd>&rarr;</kbd> or <kbd>A</kbd>
              <kbd>D</kbd> select
            </span>
            <span>
              <kbd>Enter</kbd> open
            </span>
          </p>
          <button className={styles.go} type="button" onClick={open}>
            Open <span>{cur.name}</span>
          </button>
        </div>
      </main>

      <footer className={styles.foot}>
        <p>Bookings managed by their parents.</p>
        <p>
          Home option 08 of 10 &mdash; Character Select &middot;{" "}
          <Link className={styles.foot__link} href="/home-page-designs">
            All home designs
          </Link>
        </p>
      </footer>

      {/* Transition layer: accent wipe out of the chosen frame, then the route changes. */}
      {going && (
        <div className={styles.wipe} ref={wipeRef} aria-hidden="true">
          <div className={styles.wipe__in} ref={wipeInRef}>
            <span className={styles.wipe__tag}>P{going.i + 1} ready</span>
            <p className={c("wipe__nm", "disp")}>{PLAYERS[going.i].name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
