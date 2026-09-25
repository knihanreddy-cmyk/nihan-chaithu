"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: string[]) => names.map((n) => styles[n]).join(" ");

const SNAP = "cubic-bezier(.75,0,.2,1)";
/** Navigate even if the sweep never reports finishing. */
const SAFETY_MS = 2400;

type Side = "c" | "n";
type Pt = [number, number];
type Sweep = { side: Side; name: string; href: string; from: string; to: string; reduce: boolean };

const isPlainClick = (e: MouseEvent<HTMLAnchorElement>) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;

const poly = (pts: Pt[]) => `polygon(${pts.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(", ")})`;

/** Shape of the chosen field in viewport coordinates (from) and full-screen (to), same point order. */
function shapes(stage: HTMLElement, side: Side): { from: Pt[]; to: Pt[] } {
  const cs = getComputedStyle(stage);
  const pct = (name: string) => (parseFloat(cs.getPropertyValue(name)) || 50) / 100;
  const R = stage.getBoundingClientRect();
  const W = document.documentElement.clientWidth;
  const H = window.innerHeight;
  if (!window.matchMedia("(max-width: 700px)").matches) {
    const xt = R.left + pct("--xt") * R.width;
    const xb = R.left + pct("--xb") * R.width;
    const slant = ((xt - xb) / R.height) * H;
    return side === "c"
      ? {
          from: [[R.left, R.top], [xt, R.top], [xb, R.bottom], [R.left, R.bottom]],
          to: [[0, 0], [W + slant, 0], [W, H], [0, H]],
        }
      : {
          from: [[xt, R.top], [R.right, R.top], [R.right, R.bottom], [xb, R.bottom]],
          to: [[0, 0], [W, 0], [W, H], [-slant, H]],
        };
  }
  const yl = R.top + pct("--yl") * R.height;
  const yr = R.top + pct("--yr") * R.height;
  const slant = ((yl - yr) / R.width) * W;
  return side === "c"
    ? {
        from: [[R.left, R.top], [R.right, R.top], [R.right, yr], [R.left, yl]],
        to: [[0, 0], [W, 0], [W, H], [0, H + slant]],
      }
    : {
        from: [[R.left, yl], [R.right, yr], [R.right, R.bottom], [R.left, R.bottom]],
        to: [[0, 0], [W, -slant], [W, H], [0, H]],
      };
}

export default function Home6({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#F3ECE2");

  const router = useRouter();
  const stageRef = useRef<HTMLElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const sweepNameRef = useRef<HTMLParagraphElement>(null);
  const sweepPathRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);
  const [sweep, setSweep] = useState<Sweep | null>(null);

  /* If the page is restored from the bfcache mid-transition, put it back to rest. */
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      busyRef.current = false;
      setSweep(null);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  /* Run the sweep before first paint of the overlay, then navigate when it lands. */
  useLayoutEffect(() => {
    if (!sweep) return;
    const el = sweepRef.current;
    const sName = sweepNameRef.current;
    const sPath = sweepPathRef.current;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    let alive = true;
    let navigated = false;
    const navigate = () => {
      if (!alive || navigated) return;
      navigated = true;
      router.push(sweep.href);
    };
    const timer = window.setTimeout(navigate, SAFETY_MS);

    if (el && sName && sPath) {
      let done: Promise<unknown>;
      if (sweep.reduce) {
        done = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "both" }).finished;
      } else {
        el.animate([{ clipPath: sweep.from }, { clipPath: sweep.to }], { duration: 850, easing: SNAP, fill: "both" });
        sName.animate(
          [
            { opacity: 0, transform: `translateX(${sweep.side === "c" ? -18 : 18}%) scale(1.2)` },
            { opacity: 1, offset: 0.55 },
            { opacity: 1, transform: "none" },
          ],
          { duration: 700, delay: 520, easing: "cubic-bezier(.3,1.45,.55,1)", fill: "both" },
        );
        done = sPath.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
          duration: 400,
          delay: 900,
          easing: "ease-out",
          fill: "both",
        }).finished;
      }
      done.then(navigate, () => {});
    } else {
      navigate();
    }

    return () => {
      alive = false;
      window.clearTimeout(timer);
      el?.getAnimations({ subtree: true }).forEach((an) => an.cancel());
      html.style.overflow = prevOverflow;
    };
  }, [sweep, router]);

  const onChoose = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return; // let ctrl/cmd/shift/middle-click open normally
    e.preventDefault();
    if (busyRef.current) return; // guard against double clicks
    busyRef.current = true;

    const a = e.currentTarget;
    const href = a.getAttribute("href") ?? "/";
    const side: Side = a.dataset.side === "n" ? "n" : "c";
    const stage = stageRef.current;
    if (!stage) {
      router.push(href);
      return;
    }
    const sh = shapes(stage, side);
    setSweep({
      side,
      name: a.dataset.name ?? "",
      href,
      from: poly(sh.from),
      to: poly(sh.to),
      reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  };

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <div className={styles.page} inert={sweep !== null}>
        <header className={styles.top}>
          <p className={styles.mark} aria-label="Chaithrika and Nihan">
            C<span>&amp;</span>N
          </p>
          <p className={styles.top__meta}>
            <span>Chaithrika &amp; Nihan</span>
            <b aria-hidden="true" />
            <span>Pick a portfolio</span>
          </p>
        </header>

        <main className={styles.stage} ref={stageRef} aria-label="Choose a portfolio">
          <Link
            className={c("field", "field--c")}
            href="/chaithrika"
            data-name="Chaithrika"
            data-side="c"
            onClick={onChoose}
          >
            <h2 className={c("name", "name--c")}>
              <span>Chaithrika</span>
            </h2>
            <div className={c("meta", "meta--c")}>
              <p className={styles.kicker}>01 / Model &amp; Actress</p>
              <p>IKFW Season 11 &middot; 18.12.2024</p>
              <p>Runway &middot; Editorial &middot; Commercial &middot; Acting</p>
              <span className={styles.go}>
                Enter portfolio <i aria-hidden="true">&rarr;</i>
              </span>
            </div>
          </Link>

          <Link
            className={c("field", "field--n")}
            href="/nihan"
            data-name="Nihan"
            data-side="n"
            onClick={onChoose}
          >
            {/* Replace with <Image {...designImage("nihan")} alt="Nihan" sizes="100vw" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} /> when Nihan's photos are ready */}
            <div
              className={c("portrait", "portrait--placeholder")}
              data-swap="nihan"
              role="img"
              aria-label="Nihan's portrait is coming soon"
            >
              <span className={styles.ph__dots} />
              <span className={styles.ph__n} aria-hidden="true">
                <span>N</span>
              </span>
              <span className={styles.ph__cap}>Portrait coming soon</span>
            </div>
            <div className={c("meta", "meta--n")}>
              <p className={styles.kicker}>02 / Portfolio</p>
              <p>New faces, fresh frames</p>
              <span className={styles.go}>
                Enter Nihan&rsquo;s world <i aria-hidden="true">&rarr;</i>
              </span>
            </div>
            <h2 className={c("name", "name--n")}>
              <span>Nihan</span>
            </h2>
          </Link>

          <span className={styles.seam} aria-hidden="true" />
          <Image
            {...designImage("runway-cutout")}
            alt=""
            sizes="(max-width: 700px) 45vw, 420px"
            preload
            className={styles.cutout}
          />
        </main>

        <footer className={styles.foot}>
          <p>Bookings managed by their parents</p>
          <p>Home option 06 of 10 &mdash; Diagonal Split</p>
          <p>
            <Link className={styles.foot__link} href="/home-page-designs">
              All home designs
            </Link>
          </p>
        </footer>
      </div>

      {sweep && (
        <div
          ref={sweepRef}
          className={c("sweep", `sweep--${sweep.side}`)}
          style={{ clipPath: sweep.reduce ? "none" : sweep.to }}
          aria-hidden="true"
        >
          <p ref={sweepNameRef} className={styles.sweep__name}>
            {sweep.name}
          </p>
          <p ref={sweepPathRef} className={styles.sweep__path}>
            Opening {sweep.href}
          </p>
        </div>
      )}
    </div>
  );
}
