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

/** Arch takeover timing from the template: 120ms hold, then a 1s grow to fill the viewport. */
const GROW_DELAY = 120;
const GROW_DURATION = 1000;
const REDUCED_DURATION = 300;
const SAFETY_MARGIN = 700;

export default function Home7({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#EFE8DF");

  const router = useRouter();
  const layerRef = useRef<HTMLDivElement>(null);
  const frameCRef = useRef<HTMLSpanElement>(null);
  const frameNRef = useRef<HTMLSpanElement>(null);
  const cloneRef = useRef<HTMLElement | null>(null);
  const animsRef = useRef<Animation[]>([]);
  const timerRef = useRef<number | undefined>(undefined);
  const busyRef = useRef(false);
  const [chosen, setChosen] = useState<Who | null>(null);

  /** Cancel animations/timers and remove the cloned takeover frame. */
  const teardown = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
    for (const a of animsRef.current) {
      a.onfinish = null;
      a.cancel();
    }
    animsRef.current = [];
    cloneRef.current?.remove();
    cloneRef.current = null;
    busyRef.current = false;
  }, []);

  /* Coming back via bfcache would restore the grown arch — reset it. Clean up on unmount. */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        teardown();
        setChosen(null);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      teardown();
    };
  }, [teardown]);

  const onChoose = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified / non-primary clicks open normally (new tab, window, download…).
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busyRef.current) return;
    const who: Who = e.currentTarget.dataset.who === "n" ? "n" : "c";
    const frame = (who === "n" ? frameNRef : frameCRef).current;
    const layer = layerRef.current;
    if (!frame || !layer) return;
    busyRef.current = true;

    const href = HREF[who];
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timerRef.current);
      router.push(href);
    };

    // Measure before .is-leaving drops the hover lift, then clone the frame into the fixed layer.
    const r = frame.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rad = `${r.width / 2}px`;
    const radius = `${rad} ${rad} 14px 14px`;

    const clone = frame.cloneNode(true) as HTMLElement;
    clone.classList.add(styles.takeover);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelector("[data-swap]")?.removeAttribute("role");
    clone.style.cssText = `top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;border-radius:${radius};`;
    layer.appendChild(clone);
    cloneRef.current = clone;
    setChosen(who);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!clone.animate) {
      go();
      return;
    }

    let main: Animation;
    let total: number;
    if (reduce) {
      clone.style.cssText = "top:0;left:0;width:100%;height:100%;border-radius:0;";
      main = clone.animate([{ opacity: 0 }, { opacity: 1 }], { duration: REDUCED_DURATION, fill: "both" });
      total = REDUCED_DURATION;
      animsRef.current = [main];
    } else {
      main = clone.animate(
        [
          {
            top: `${r.top}px`,
            left: `${r.left}px`,
            width: `${r.width}px`,
            height: `${r.height}px`,
            borderRadius: radius,
          },
          { top: "0px", left: "0px", width: `${vw}px`, height: `${vh}px`, borderRadius: "0px 0px 0px 0px" },
        ],
        { duration: GROW_DURATION, delay: GROW_DELAY, easing: "cubic-bezier(.65,0,.2,1)", fill: "both" },
      );
      total = GROW_DELAY + GROW_DURATION;
      animsRef.current = [main];
      const img = clone.querySelector("img");
      if (img) {
        animsRef.current.push(
          img.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }], {
            duration: 1600,
            easing: "ease-out",
            fill: "both",
          }),
        );
      }
    }
    main.onfinish = go;
    timerRef.current = window.setTimeout(go, total + SAFETY_MARGIN);
  };

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <header className={styles.top}>
        <h1 className={styles.mark}>
          Chaithrika <em>&amp;</em> Nihan
        </h1>
        <p className={styles.top__right}>Family portfolio</p>
      </header>

      <main className={c("stage", chosen && "is-leaving")}>
        <p className={styles.meet}>come and meet</p>

        <nav className={styles.pair} aria-label="Choose a portfolio">
          <Link
            href={HREF.c}
            className={c("choice", "choice--c", chosen === "c" && "is-chosen")}
            data-who="c"
            onClick={onChoose}
          >
            <span className={styles.float}>
              <span className={styles.arch}>
                <span className={styles.halo} aria-hidden="true" />
                <span className={styles.arch__frame} ref={frameCRef}>
                  <Image
                    {...designImage("white-chair")}
                    alt="Chaithrika in a white tulle dress on a white chair"
                    sizes="(max-width: 640px) 39vw, 330px"
                    preload
                    className={styles.arch__img}
                  />
                </span>
              </span>
            </span>
            <span className={styles.label}>
              <span className={styles.label__name}>Chaithrika</span>
              <span className={styles.label__role}>Model &amp; Actress</span>
              <span className={styles.label__cta}>
                enter her world <span aria-hidden="true">&rarr;</span>
              </span>
            </span>
          </Link>

          <span className={styles.and} aria-hidden="true">
            and
          </span>

          <Link
            href={HREF.n}
            className={c("choice", "choice--n", chosen === "n" && "is-chosen")}
            data-who="n"
            onClick={onChoose}
          >
            <span className={styles.float}>
              <span className={styles.arch}>
                <span className={styles.halo} aria-hidden="true" />
                <span className={styles.arch__frame} ref={frameNRef}>
                  {/* Replace with <Image {...designImage("nihan")} … /> when Nihan's photos are ready */}
                  <span
                    className={c("portrait", "portrait--placeholder")}
                    data-swap="nihan"
                    role="img"
                    aria-label="Nihan, portrait coming soon"
                  >
                    <span className={styles.ph__n} aria-hidden="true">
                      N
                    </span>
                    <span className={styles.ph__name} aria-hidden="true">
                      NIHAN
                    </span>
                    <span className={styles.ph__rule} aria-hidden="true" />
                    <span className={styles.ph__cap} aria-hidden="true">
                      portrait coming soon
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <span className={styles.label}>
              <span className={styles.label__name}>Nihan</span>
              <span className={styles.label__role}>Portfolio</span>
              <span className={styles.label__cta}>
                enter his world <span aria-hidden="true">&rarr;</span>
              </span>
            </span>
          </Link>
        </nav>
      </main>

      <footer className={styles.foot}>
        <p>Bookings managed by their parents</p>
        <p>
          Home option 07 of 10 <em>—</em> Soft Arches
        </p>
        <p>
          <Link href="/home-page-designs" className={styles.foot__link}>
            All home designs
          </Link>
        </p>
      </footer>

      {/* The chosen arch frame is cloned in here and grown to fill the screen before navigating. */}
      <div className={styles.layer} ref={layerRef} aria-hidden="true" />
    </div>
  );
}
