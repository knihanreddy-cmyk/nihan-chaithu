"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: string[]) => names.map((n) => styles[n]).join(" ");

/** Per-line intro delay (the template's inline `--d`). */
const d = (delay: string) => ({ "--d": delay }) as CSSProperties;

const EASE = "cubic-bezier(.2,.7,.1,1)";
/** Navigate even if the exit animation never reports finishing. */
const SAFETY_MS = 2400;

/** A running exit transition: the chosen link plus the nodes built for it. */
type Run = {
  a: HTMLAnchorElement;
  nodes: HTMLElement[];
  timer: number;
  prevOverflow: string;
};

const isPlainClick = (e: MouseEvent<HTMLAnchorElement>) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;

const box = (r: DOMRect) => ({
  left: `${r.left}px`,
  top: `${r.top}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
});

const full = () => ({
  left: "0px",
  top: "0px",
  width: `${document.documentElement.clientWidth}px`,
  height: `${window.innerHeight}px`,
});

/** Undo a transition: remove the stage, unlock scrolling, restore the chosen half. */
function teardown(run: Run, page: HTMLElement | null) {
  window.clearTimeout(run.timer);
  run.nodes.forEach((n) => {
    n.getAnimations({ subtree: true }).forEach((an) => an.cancel());
    n.remove();
  });
  run.a.classList.remove(styles["is-chosen"]);
  if (page) page.inert = false;
  document.documentElement.style.overflow = run.prevOverflow;
}

export default function Home1({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#F7F5F0");

  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<Run | null>(null);

  /* Reset if the page comes back from the bfcache mid-transition, and on unmount. */
  useEffect(() => {
    const page = pageRef.current;
    const reset = () => {
      if (runRef.current) {
        teardown(runRef.current, page);
        runRef.current = null;
      }
    };
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) reset();
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      reset();
    };
  }, []);

  async function go(a: HTMLAnchorElement) {
    const href = a.getAttribute("href") ?? "/";
    const page = pageRef.current;
    const top = topRef.current;
    const layer = layerRef.current;
    const nameEl = a.querySelector<HTMLElement>("[data-name-el]");
    if (!page || !top || !layer || !nameEl) {
      router.push(href);
      return;
    }

    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = a.getBoundingClientRect();
    const W = html.clientWidth;
    const nr = nameEl.getBoundingClientRect();
    const cs = getComputedStyle(nameEl);
    const gx = parseFloat(getComputedStyle(top).paddingLeft) || 24;

    // Clone the chosen half into a fixed stage that grows to fill the viewport.
    const stage = document.createElement("div");
    stage.className = styles.stage;
    stage.setAttribute("aria-hidden", "true");
    for (const ch of Array.from(a.children)) stage.appendChild(ch.cloneNode(true));
    const topShade = document.createElement("div");
    topShade.className = styles.stage__shade;
    stage.appendChild(topShade);
    Object.assign(stage.style, box(r));

    // The name travels from the panel to a page-title position at top left.
    const title = document.createElement("div");
    title.className = styles.stage__name;
    title.setAttribute("aria-hidden", "true");
    title.textContent = nameEl.textContent;
    Object.assign(title.style, {
      left: `${nr.left}px`,
      top: `${nr.top}px`,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
    });

    const targetFs = W < 760 ? 30 : 40;
    const sc = targetFs / parseFloat(cs.fontSize);
    const tx = gx - nr.left;
    const ty = 22 - nr.top;
    const rule = document.createElement("div");
    rule.className = styles.stage__rule;
    Object.assign(rule.style, {
      left: `${gx}px`,
      right: `${gx}px`,
      top: `${22 + nr.height * sc + 14}px`,
    });

    layer.append(stage, title, rule);

    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      window.clearTimeout(run.timer);
      router.push(href);
    };
    const run: Run = {
      a,
      nodes: [stage, title, rule],
      timer: window.setTimeout(navigate, SAFETY_MS),
      prevOverflow: html.style.overflow,
    };
    runRef.current = run;
    a.classList.add(styles["is-chosen"]);
    page.inert = true;
    html.style.overflow = "hidden";

    const endT = `translate(${tx}px, ${ty}px) scale(${sc})`;
    const fadeOut = [stage.querySelector<HTMLElement>("[data-copy]"), stage.querySelector<HTMLElement>("[data-tag]")];

    try {
      if (reduce) {
        Object.assign(stage.style, full());
        title.style.transform = endT;
        rule.style.transform = "none";
        fadeOut.forEach((el) => el && (el.style.opacity = "0"));
        const f = [{ opacity: 0 }, { opacity: 1 }];
        await Promise.all([stage, title, rule].map((el) => el.animate(f, { duration: 260, fill: "both" }).finished));
      } else {
        fadeOut.forEach((el) => el?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: "forwards" }));
        stage.animate([box(r), full()], { duration: 950, easing: EASE, fill: "forwards" });
        topShade.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 500, fill: "both" });
        const t = title.animate([{ transform: "none" }, { transform: endT }], {
          duration: 800,
          delay: 480,
          easing: EASE,
          fill: "both",
        });
        rule.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
          duration: 800,
          delay: 1050,
          easing: EASE,
          fill: "both",
        });
        await t.finished;
      }
    } catch {
      // Animation cancelled (teardown) — handled below.
    }
    // Only navigate if this transition is still the live one (not torn down by bfcache/unmount).
    if (runRef.current === run) navigate();
  }

  const onChoose = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return; // let ctrl/cmd/shift/middle-click open normally
    e.preventDefault();
    if (runRef.current) return; // guard against double clicks
    void go(e.currentTarget);
  };

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <div className={styles.page} ref={pageRef}>
        <header className={styles.top} ref={topRef}>
          <p className={styles.mark} aria-label="Chaithrika and Nihan">
            C<i>&amp;</i>N <small>Chaithrika &amp; Nihan</small>
          </p>
          <p className={styles.eyebrow}>Choose a portfolio</p>
        </header>

        <main className={styles.split} aria-label="Choose a portfolio">
          <Link className={c("half", "half--c")} href="/chaithrika" onClick={onChoose}>
            <div className={styles.media}>
              <Image
                {...designImage("blue-gown")}
                alt="Chaithrika in a teal ball gown against a pink studio backdrop"
                sizes="(max-width: 759px) 100vw, 62vw"
                preload
                className={styles.photo}
              />
            </div>
            <div className={styles.shade} />
            <span className={styles.tag} data-tag="">
              IKFW &middot; Season 11
            </span>
            <div className={styles.copy} data-copy="">
              <span className={styles.ln}>
                <span className={styles.label} style={d(".88s")}>
                  01 &mdash; Model &amp; Actress
                </span>
              </span>
              <span className={styles.ln}>
                <span className={styles.pre} style={d(".94s")}>
                  the portfolio of
                </span>
              </span>
              <span className={c("ln", "ln--name")}>
                <span className={styles.name} style={d("1s")} data-name-el="">
                  Chaithrika
                </span>
              </span>
              <span className={styles.ln}>
                <span className={styles.meta} style={d("1.08s")}>
                  Runway &middot; Editorial &middot; Commercial &middot; Acting
                </span>
              </span>
              <span className={styles.ln}>
                <span style={d("1.14s")}>
                  <span className={styles.cta}>Enter portfolio</span>
                </span>
              </span>
            </div>
          </Link>

          <Link className={c("half", "half--n")} href="/nihan" onClick={onChoose}>
            <div className={styles.media}>
              {/* Replace with <Image {...designImage("nihan")} alt="Nihan" sizes="(max-width: 759px) 100vw, 62vw" className={styles.photo} /> when Nihan's photos are ready */}
              <div
                className={c("portrait", "portrait--placeholder")}
                data-swap="nihan"
                role="img"
                aria-label="Nihan's portrait is coming soon"
              >
                <span className={styles.ph__frame} />
                <span className={styles.ph__n} aria-hidden="true">
                  N
                </span>
              </div>
            </div>
            <div className={styles.shade} />
            <span className={styles.tag} data-tag="">
              Portrait coming soon
            </span>
            <div className={styles.copy} data-copy="">
              <span className={styles.ln}>
                <span className={styles.label} style={d(".94s")}>
                  02 &mdash; Portfolio
                </span>
              </span>
              <span className={styles.ln}>
                <span className={styles.pre} style={d("1s")}>
                  the portfolio of
                </span>
              </span>
              <span className={c("ln", "ln--name")}>
                <span className={styles.name} style={d("1.06s")} data-name-el="">
                  Nihan
                </span>
              </span>
              <span className={styles.ln}>
                <span className={styles.meta} style={d("1.14s")}>
                  New faces, fresh frames
                </span>
              </span>
              <span className={styles.ln}>
                <span style={d("1.2s")}>
                  <span className={styles.cta}>Enter Nihan&rsquo;s world</span>
                </span>
              </span>
            </div>
          </Link>

          <span className={styles.hairline} aria-hidden="true" />
        </main>

        <footer className={styles.foot}>
          <p>Bookings managed by their parents</p>
          <p>Home option 01 of 10 &mdash; Split Screen Expand</p>
          <p>
            <Link className={styles.foot__link} href="/home-page-designs">
              All home designs
            </Link>
          </p>
        </footer>
      </div>

      {/* Exit-transition layer: filled imperatively with the stage, title and rule on click. */}
      <div ref={layerRef} />
    </div>
  );
}
