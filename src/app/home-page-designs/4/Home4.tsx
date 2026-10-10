"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent as ReactFocusEvent, type PointerEvent as ReactPointerEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original names. */
const c = (...names: (string | false | null | undefined)[]) =>
  names
    .filter((n): n is string => Boolean(n))
    .map((n) => styles[n])
    .join(" ");

type Who = "c" | "n";

const HREF: Record<Who, string> = { c: "/chaithrika", n: "/nihan" };
const EASE = "cubic-bezier(.7,0,.2,1)";
const ZOOM_MS = 950;
const FADE_MS = 280;
/** Extra time before we navigate anyway if the animation never reports finishing. */
const SAFETY_MS = 600;

const FULL = { top: "0px", left: "0px", width: "100%", height: "100%", borderRadius: "0px" };

function rectKeys(r: DOMRect, radius: string) {
  return { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: radius };
}

function Arrow() {
  return (
    <span className={styles.go} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export default function Home4({
  fontClassName,
  preview = true,
}: {
  fontClassName: string;
  /** Shows the "Home option 04 of 10" footer line used on /home-page-designs. */
  preview?: boolean;
}) {
  usePageBackground("#F3EFF4");
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement>(null);
  const takeoverRef = useRef<HTMLDivElement>(null);
  const frameCRef = useRef<HTMLSpanElement>(null);
  const frameNRef = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const busyRef = useRef(false);

  const [hover, setHover] = useState<Who | "">("");
  const [chosen, setChosen] = useState<Who | null>(null);

  /* Pointer parallax for the glass chips (max 12px). */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chips = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          chips.forEach((chip) => {
            const d = parseFloat(chip.dataset.depth ?? "") || 1;
            chip.style.setProperty("--px", `${(nx * 12 * d).toFixed(2)}px`);
            chip.style.setProperty("--py", `${(ny * 12 * d).toFixed(2)}px`);
          });
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* If the page is restored from the back/forward cache mid-transition, put it back to rest. */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      const takeover = takeoverRef.current;
      if (takeover) {
        takeover.getAnimations().forEach((a) => a.cancel());
        takeover.replaceChildren();
        takeover.removeAttribute("style");
      }
      busyRef.current = false;
      rectRef.current = null;
      setChosen(null);
      setHover("");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  /* The takeover: the chosen photo grows from its frame to fill the screen, then we navigate. */
  useLayoutEffect(() => {
    if (!chosen) return;
    const takeover = takeoverRef.current;
    const r = rectRef.current;
    if (!takeover || !r) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let anim: Animation;
    if (reduce) {
      Object.assign(takeover.style, FULL);
      anim = takeover.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_MS, fill: "forwards" });
    } else {
      Object.assign(takeover.style, rectKeys(r, "18px"));
      const vw = `${window.innerWidth}px`;
      const vh = `${window.innerHeight}px`;
      anim = takeover.animate(
        [
          { ...rectKeys(r, "18px"), filter: "blur(0px) saturate(1)" },
          { top: "0px", left: "0px", width: vw, height: vh, borderRadius: "0px", filter: "blur(2px) saturate(1.1)", offset: 0.7 },
          { top: "0px", left: "0px", width: vw, height: vh, borderRadius: "0px", filter: "blur(0px) saturate(1)" },
        ],
        { duration: ZOOM_MS, easing: EASE, fill: "forwards" },
      );
    }

    let done = false;
    const navigate = () => {
      if (done) return;
      done = true;
      Object.assign(takeover.style, FULL);
      router.push(HREF[chosen]);
    };
    anim.finished.then(navigate, () => {});
    const safety = window.setTimeout(navigate, (reduce ? FADE_MS : ZOOM_MS) + SAFETY_MS);

    return () => {
      done = true;
      window.clearTimeout(safety);
      anim.cancel();
    };
  }, [chosen, router]);

  /* Plain clicks (and Enter) only — Link skips onNavigate for modified/middle clicks. */
  const choose = (who: Who, e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (busyRef.current) return;
    const frame = (who === "c" ? frameCRef : frameNRef).current;
    const takeover = takeoverRef.current;
    const media = frame?.querySelector("img, [data-swap]");
    if (!frame || !takeover || !media) {
      router.push(HREF[who]);
      return;
    }
    busyRef.current = true;
    const clone = media.cloneNode(true) as HTMLElement;
    ["role", "aria-label", "fetchpriority", "data-swap"].forEach((a) => clone.removeAttribute(a));
    if (clone instanceof HTMLImageElement) clone.loading = "eager";
    takeover.replaceChildren(clone);
    rectRef.current = frame.getBoundingClientRect();
    setHover(who);
    setChosen(who);
  };

  const whoOf = (el: HTMLElement): Who => (el.dataset.who === "n" ? "n" : "c");
  const onEnter = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "mouse" && !busyRef.current) setHover(whoOf(e.currentTarget));
  };
  const onFocusPortal = (e: ReactFocusEvent<HTMLAnchorElement>) => {
    if (!busyRef.current) setHover(whoOf(e.currentTarget));
  };
  const onLeave = () => {
    if (!busyRef.current) setHover("");
  };

  return (
    <div
      ref={rootRef}
      className={`${c("root", chosen && "leaving")} ${fontClassName}`}
      data-hover={hover || undefined}
    >
      <div className={styles.field} aria-hidden="true">
        <div className={styles.field__inner}>
          <span className={c("blob", "blob--1", "blob--warm")} />
          <span className={c("blob", "blob--2", "blob--warm")} />
          <span className={c("blob", "blob--5")} />
          <span className={c("blob", "blob--3", "blob--cool")} />
          <span className={c("blob", "blob--4", "blob--cool")} />
        </div>
      </div>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.page}>
        <header className={styles.top}>
          <Link className={styles.mark} href="/" aria-label="Chaithrika and Nihan, home">
            <span className={styles.full}>
              Chaithrika <i>&amp;</i> Nihan
            </span>
            <span className={styles.short}>
              C <i>&amp;</i> N
            </span>
          </Link>
          <span className={c("pill", "glass")}>Family portfolio &middot; India</span>
        </header>

        <main className={styles.main}>
          <div className={styles.lede}>
            <p>Two portfolios, one family</p>
            <h1>
              Choose a <em>world</em>
            </h1>
          </div>

          <nav className={styles.portals} aria-label="Choose a portfolio">
            <Link
              className={c("portal", "portal--c", chosen === "c" && "is-chosen")}
              href={HREF.c}
              data-who="c"
              onNavigate={(e) => choose("c", e)}
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
              onFocus={onFocusPortal}
              onBlur={onLeave}
            >
              <span className={c("portal__glass", "glass")} aria-hidden="true" />
              <span className={c("chip", "chip--a", "glass")} data-depth="1" aria-hidden="true">
                <span className={styles.dot} />
                <b>IKFW</b> Season 11
              </span>
              <span className={c("chip", "chip--b", "glass")} data-depth="-.7" aria-hidden="true">
                <span className={styles.dot} />
                Amazon Kids
              </span>
              <span className={styles.portal__body}>
                <span className={styles.portal__frame} ref={frameCRef}>
                  <Image
                    {...designImage("blue-gown")}
                    alt="Chaithrika in a teal ball gown against a pink studio backdrop"
                    sizes="(max-width: 760px) min(92vw, 432px), (max-width: 1040px) 42vw, 410px"
                    preload
                  />
                </span>
                <span className={styles.portal__meta}>
                  <span className={styles.eyebrow}>Model &amp; actress</span>
                  <span className={styles.name}>
                    Chaith<em>rika</em>
                  </span>
                  <span className={styles.sub}>Runway &middot; Editorial &middot; Commercial &middot; Acting</span>
                  <Arrow />
                </span>
                <span className={styles.sr}>Enter Chaithrika&apos;s portfolio</span>
              </span>
            </Link>

            <Link
              className={c("portal", "portal--n", chosen === "n" && "is-chosen")}
              href={HREF.n}
              data-who="n"
              onNavigate={(e) => choose("n", e)}
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
              onFocus={onFocusPortal}
              onBlur={onLeave}
            >
              <span className={c("portal__glass", "glass")} aria-hidden="true" />
              <span className={c("chip", "chip--a", "glass")} data-depth="-1" aria-hidden="true">
                <span className={styles.dot} />
                Growing up in frames
              </span>
              <span className={c("chip", "chip--b", "glass")} data-depth=".7" aria-hidden="true">
                <span className={styles.dot} />
                New faces
              </span>
              <span className={styles.portal__body}>
                <span className={styles.portal__frame} ref={frameNRef}>
                  <Image
                    src="/images/nihan/nihan-06.jpg"
                    width={1063}
                    height={1600}
                    alt="Nihan in a navy embroidered kurta and sunglasses against a grey studio backdrop"
                    sizes="(max-width: 760px) min(92vw, 432px), (max-width: 1040px) 42vw, 410px"
                    preload
                  />
                </span>
                <span className={styles.portal__meta}>
                  <span className={styles.eyebrow}>Portfolio</span>
                  <span className={styles.name}>
                    Ni<em>han</em>
                  </span>
                  <span className={styles.sub}>New faces, fresh frames</span>
                  <Arrow />
                </span>
                <span className={styles.sr}>Enter Nihan&apos;s world</span>
              </span>
            </Link>
          </nav>
        </main>

        <footer className={styles.foot}>
          <span>Bookings managed by their parents</span>
          {preview && (
            <span className={styles.foot__r}>
              <span className={styles.foot__opt}>Home option 04 of 10 &mdash; Glass Portals</span>
              <Link className={styles.foot__link} href="/home-page-designs">
                All home designs
              </Link>
            </span>
          )}
        </footer>
      </div>

      <div className={styles.takeover} ref={takeoverRef} hidden={!chosen} aria-hidden="true" />
    </div>
  );
}
