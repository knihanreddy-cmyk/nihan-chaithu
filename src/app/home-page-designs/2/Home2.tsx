"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (BEM) names. */
const c = (...names: (string | false | null | undefined)[]) =>
  names
    .map((n) => (n ? styles[n] : undefined))
    .filter(Boolean)
    .join(" ");

type Who = "c" | "n";
const HREF: Record<Who, string> = { c: "/chaithrika", n: "/nihan" };

/** Flood reveal timing from the template: 360ms hold, then a 1s beam-to-fullscreen sweep. */
const FLOOD_DELAY = 360;
const FLOOD_DURATION = 1000;
const REDUCED_DURATION = 280;
const SAFETY_MARGIN = 700;

function poly(pts: [number, number][]) {
  return `polygon(${pts.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(", ")})`;
}

export default function Home2({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#0A0908");

  const router = useRouter();
  const floodRef = useRef<HTMLDivElement>(null);
  const lightCRef = useRef<HTMLSpanElement>(null);
  const lightNRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<Animation | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const busyRef = useRef(false);
  const [chosen, setChosen] = useState<Who | null>(null);

  /** Drop any in-flight transition and return the stage to its resting state. */
  const reset = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
    if (animRef.current) {
      animRef.current.onfinish = null;
      animRef.current.cancel();
      animRef.current = null;
    }
    busyRef.current = false;
    setChosen(null);
  }, []);

  /* Coming back via bfcache would restore the flooded screen — reset it. Clean up on unmount. */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) reset();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.clearTimeout(timerRef.current);
      if (animRef.current) {
        animRef.current.onfinish = null;
        animRef.current.cancel();
        animRef.current = null;
      }
      busyRef.current = false;
    };
  }, [reset]);

  /** Spotlight cone → full-screen polygon, measured from the chosen act's light rig. */
  const keyframes = (light: HTMLElement, flood: HTMLElement): Keyframe[] => {
    const r = light.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = r.left + r.width / 2;
    const top = Math.max(r.top, -40);
    const bot = Math.max(r.bottom, top + 40);
    const spread = parseFloat(getComputedStyle(light).getPropertyValue("--spread")) || 20;
    const half = (bot - top) * Math.tan((spread * Math.PI) / 180);
    const halfV = (vh - top) * Math.tan((spread * 1.9 * Math.PI) / 180);
    flood.style.setProperty("--x", `${cx}px`);
    return [
      {
        clipPath: poly([
          [cx - 5, top],
          [cx + 5, top],
          [cx + half, bot],
          [cx - half, bot],
        ]),
        opacity: 0,
      },
      {
        clipPath: poly([
          [cx - 30, top],
          [cx + 30, top],
          [cx + halfV, vh],
          [cx - halfV, vh],
        ]),
        opacity: 0.8,
        offset: 0.42,
      },
      {
        clipPath: poly([
          [0, 0],
          [vw, 0],
          [vw, vh],
          [0, vh],
        ]),
        opacity: 1,
      },
    ];
  };

  const onChoose = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified / non-primary clicks open normally (new tab, window, download…).
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busyRef.current) return;
    const flood = floodRef.current;
    const who: Who = e.currentTarget.dataset.who === "n" ? "n" : "c";
    const light = (who === "n" ? lightNRef : lightCRef).current;
    if (!flood || !light) return;
    busyRef.current = true;

    const href = HREF[who];
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timerRef.current);
      router.push(href);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames = reduce || !flood.animate ? null : keyframes(light, flood);
    flood.hidden = false;
    setChosen(who);

    if (!flood.animate) {
      go();
      return;
    }
    let total: number;
    if (!frames) {
      total = REDUCED_DURATION;
      animRef.current = flood.animate([{ opacity: 0 }, { opacity: 1 }], { duration: REDUCED_DURATION, fill: "both" });
    } else {
      total = FLOOD_DELAY + FLOOD_DURATION;
      animRef.current = flood.animate(frames, {
        duration: FLOOD_DURATION,
        delay: FLOOD_DELAY,
        easing: "cubic-bezier(.7,0,.2,1)",
        fill: "both",
      });
    }
    animRef.current.onfinish = go;
    timerRef.current = window.setTimeout(go, total + SAFETY_MARGIN);
  };

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <header className={styles.top}>
        <h1 className={styles.mark}>
          <span className={styles.mark__cn} aria-hidden="true">
            C<span>&amp;</span>N
          </span>
          <span className={styles.mark__full}>Chaithrika &amp; Nihan</span>
        </h1>
        <p className={styles.top__right}>Two portfolios</p>
      </header>

      <main className={c("stage", chosen && "is-leaving")}>
        <div className={styles.valance} aria-hidden="true" />
        <div className={c("curtain", "curtain--l")} aria-hidden="true" />
        <div className={c("curtain", "curtain--r")} aria-hidden="true" />
        <p className={styles.billing}>Presenting</p>

        <nav className={styles.acts} aria-label="Choose a portfolio">
          <Link
            href={HREF.c}
            className={c("act", "act--c", chosen === "c" && "is-chosen")}
            data-who="c"
            onClick={onChoose}
          >
            <span className={styles.light} aria-hidden="true" ref={lightCRef}>
              <span className={styles.cone} />
              <span className={styles.pool} />
              <span className={styles.lamp} />
            </span>
            <span className={styles.figure}>
              <Image
                {...designImage("runway-cutout")}
                alt="Chaithrika on the runway at India Kids Fashion Week"
                sizes="(max-width: 640px) 190px, 300px"
                preload
                className={styles.figure__img}
              />
            </span>
            <span className={styles.card}>
              <span className={styles.card__no}>Act I</span>
              <span className={styles.card__name}>Chaithrika</span>
              <span className={styles.card__meta}>Model &amp; Actress</span>
              <span className={styles.card__sub}>Runway · Editorial · Acting</span>
              <span className={styles.card__cta}>
                Enter her world <i aria-hidden="true" />
              </span>
            </span>
          </Link>

          <Link
            href={HREF.n}
            className={c("act", "act--n", chosen === "n" && "is-chosen")}
            data-who="n"
            onClick={onChoose}
          >
            <span className={styles.light} aria-hidden="true" ref={lightNRef}>
              <span className={styles.cone} />
              <span className={styles.pool} />
              <span className={styles.lamp} />
            </span>
            <span className={styles.figure}>
              {/* Replace with <Image {...designImage("nihan")} … /> when Nihan's photos are ready */}
              <span
                className={c("portrait", "portrait--placeholder")}
                data-swap="nihan"
                role="img"
                aria-label="Nihan, portrait coming soon"
              >
                <span className={styles.ph__star} aria-hidden="true" />
                <span className={styles.ph__n} aria-hidden="true">
                  N
                </span>
                <span className={styles.ph__rule} aria-hidden="true" />
                <span className={styles.ph__cap} aria-hidden="true">
                  Portrait
                  <br />
                  coming soon
                </span>
              </span>
            </span>
            <span className={styles.card}>
              <span className={styles.card__no}>Act II</span>
              <span className={styles.card__name}>Nihan</span>
              <span className={styles.card__meta}>Portfolio</span>
              <span className={styles.card__sub}>New faces, fresh frames</span>
              <span className={styles.card__cta}>
                Enter his world <i aria-hidden="true" />
              </span>
            </span>
          </Link>
        </nav>
      </main>

      <footer className={styles.foot}>
        <p>
          <b>Bookings managed by their parents</b>
        </p>
        <p>Home option 02 of 10 — Spotlight Stage</p>
        <p>
          <Link href="/home-page-designs" className={styles.foot__link}>
            All home designs
          </Link>
        </p>
      </footer>

      <div className={styles.flood} ref={floodRef} hidden={!chosen} aria-hidden="true" />
    </div>
  );
}
