"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: string[]) => names.map((n) => styles[n]).join(" ");

type Who = "chaithrika" | "nihan";

const DATA: Record<
  Who,
  { name: string; eyebrow: string; title: string; links: string[]; path: string; cls: string }
> = {
  chaithrika: {
    name: "Chaithrika",
    eyebrow: "Model & Actress",
    title: "Chaithrika",
    links: ["Runway", "Editorial", "Commercial", "Acting"],
    path: "/chaithrika",
    cls: "pv--c",
  },
  nihan: {
    name: "Nihan",
    eyebrow: "Portfolio · New faces, fresh frames",
    title: "Nihan",
    links: ["Portfolio"],
    path: "/nihan",
    cls: "pv--n",
  },
};

const WHO: Who[] = ["chaithrika", "nihan"];

/* Card width: two columns inside a 1180px container (22px gutters, 20px gap); one column under 760px. */
const CARD_SIZES = "(max-width: 760px) calc(100vw - 32px), (max-width: 1180px) calc(50vw - 32px), 558px";

const SAFETY_MS = 1600;

function ChaithrikaMedia({ preload }: { preload?: boolean }) {
  return (
    <Image
      {...designImage("red-peplum")}
      alt={preload ? "Chaithrika smiling in a red brocade peplum top" : ""}
      sizes={CARD_SIZES}
      className={styles.card__img}
      preload={preload}
      loading={preload ? undefined : "eager"}
    />
  );
}

function NihanPlaceholder({ decorative }: { decorative?: boolean }) {
  const filterId = `g3-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    /* Replace with <Image {...designImage("nihan")} … /> when Nihan's photos are ready */
    <div
      className={styles.placeholder}
      data-swap="nihan"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Nihan, portrait coming soon"}
      aria-hidden={decorative ? true : undefined}
    >
      <svg className={styles.grain} aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .52  0 0 0 0 .56  0 0 0 .5 0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
      <span className={styles.ph__ring} aria-hidden="true" />
      <p className={styles.ph__word} aria-hidden="true">
        Nihan
      </p>
      <span className={styles.ph__cap} aria-hidden="true">
        Portrait coming soon
      </span>
    </div>
  );
}

type Opening = { who: Who; rect: { left: number; top: number; width: number; height: number } };

export default function Home3({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#FFFFFF");

  const router = useRouter();
  const cardRefs = useRef<Record<Who, HTMLAnchorElement | null>>({ chaithrika: null, nihan: null });
  const tiltRefs = useRef<Record<Who, HTMLDivElement | null>>({ chaithrika: null, nihan: null });
  const xpRef = useRef<HTMLDivElement>(null);
  const pvRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const reduceRef = useRef(false);
  const [opening, setOpening] = useState<Opening | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceRef.current = mq.matches;
    const onChange = () => {
      reduceRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resetTilt = (who: Who) => {
    const t = tiltRefs.current[who];
    cardRefs.current[who]?.classList.remove(styles["is-tracking"]);
    t?.style.setProperty("--rx", "0deg");
    t?.style.setProperty("--ry", "0deg");
  };

  /* Put the page back in its resting state (used when restored from the back/forward cache). */
  const reset = useCallback(() => {
    xpRef.current?.getAnimations().forEach((a) => a.cancel());
    pvRef.current?.getAnimations().forEach((a) => a.cancel());
    WHO.forEach((who) => {
      const card = cardRefs.current[who];
      if (card) card.style.visibility = "";
    });
    busyRef.current = false;
    setOpening(null);
  }, []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) reset();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [reset]);

  /* Pointer tilt + sheen, mouse only. */
  const onPointerMove = (who: Who) => (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || reduceRef.current || busyRef.current) return;
    const t = tiltRefs.current[who];
    if (!t) return;
    const r = t.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    e.currentTarget.classList.add(styles["is-tracking"]);
    t.style.setProperty("--ry", `${((px - 0.5) * 10).toFixed(2)}deg`);
    t.style.setProperty("--rx", `${((0.5 - py) * 10).toFixed(2)}deg`);
    t.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    t.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  const onClick = (who: Who) => (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab / window / download) behave natively.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    resetTilt(who);
    const t = tiltRefs.current[who];
    const r = t?.getBoundingClientRect();
    setOpening({
      who,
      rect: r
        ? { left: r.left, top: r.top, width: r.width, height: r.height }
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight },
    });
  };

  /* Expand the card to fill the viewport, fade in the destination header, then navigate. */
  useLayoutEffect(() => {
    if (!opening) return;
    const xp = xpRef.current;
    const pv = pvRef.current;
    if (!xp || !pv) return;
    const { who, rect: r } = opening;
    const card = cardRefs.current[who];
    const path = DATA[who].path;
    const reduce = reduceRef.current;

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      router.push(path);
    };
    const timer = window.setTimeout(go, SAFETY_MS);
    const anims: Animation[] = [];

    if (reduce) {
      xp.style.borderRadius = "0";
      anims.push(xp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, fill: "forwards" }));
      anims.push(pv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, fill: "forwards" }));
    } else {
      if (card) card.style.visibility = "hidden";
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      anims.push(
        xp.animate(
          [
            {
              left: `${r.left}px`,
              top: `${r.top}px`,
              width: `${r.width}px`,
              height: `${r.height}px`,
              borderRadius: "28px",
              boxShadow: "0 28px 60px rgba(0,0,0,.14)",
            },
            {
              left: "0px",
              top: "0px",
              width: `${vw}px`,
              height: `${vh}px`,
              borderRadius: "0px",
              boxShadow: "0 0 0 rgba(0,0,0,0)",
            },
          ],
          { duration: 760, easing: "cubic-bezier(.32,.72,0,1)", fill: "forwards" },
        ),
      );
      anims.push(
        pv.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 0, transform: "translateY(14px)", offset: 0.45 },
            { opacity: 1, transform: "none" },
          ],
          { duration: 900, easing: "cubic-bezier(.2,.75,.2,1)", fill: "forwards" },
        ),
      );
    }

    Promise.all(anims.map((a) => a.finished)).then(go, () => {
      /* cancelled (unmount or reset) */
    });

    return () => {
      done = true;
      window.clearTimeout(timer);
      anims.forEach((a) => a.cancel());
      if (card) card.style.visibility = "";
      xp.style.borderRadius = "";
    };
  }, [opening, router]);

  const d = opening ? DATA[opening.who] : null;

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <header className={styles.bar}>
        <div className={styles.bar__in}>
          <Link className={styles.mark} href="/" aria-label="Chaithrika and Nihan, home">
            C<span>&amp;</span>N
          </Link>
          <span className={styles.bar__meta}>Chaithrika &amp; Nihan &middot; Portfolios</span>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="h3-hl">
          <h1 id="h3-hl" className={styles.title}>
            <span className={styles.line}>
              <span className={styles.w} style={{ "--i": 0 } as CSSProperties}>
                Two
              </span>{" "}
              <span className={styles.w} style={{ "--i": 1 } as CSSProperties}>
                portfolios.
              </span>
            </span>
            <span className={styles.line}>
              <span className={styles.w} style={{ "--i": 2 } as CSSProperties}>
                One
              </span>{" "}
              <span className={styles.w} style={{ "--i": 3 } as CSSProperties}>
                family.
              </span>
            </span>
          </h1>
          <p className={styles.sub}>Choose whose work you&rsquo;d like to see.</p>
        </section>

        <nav className={styles.cards} aria-label="Choose a portfolio">
          {WHO.map((who, i) => (
            <Link
              key={who}
              ref={(el) => {
                cardRefs.current[who] = el;
              }}
              className={styles.card}
              href={DATA[who].path}
              prefetch
              data-who={who}
              style={{ "--d": i } as CSSProperties}
              onPointerMove={onPointerMove(who)}
              onPointerLeave={() => resetTilt(who)}
              onClick={onClick(who)}
            >
              <div
                className={styles.card__tilt}
                ref={(el) => {
                  tiltRefs.current[who] = el;
                }}
              >
                <div className={styles.card__media}>
                  {who === "chaithrika" ? <ChaithrikaMedia preload /> : <NihanPlaceholder />}
                </div>
                <div className={styles.card__sheen} aria-hidden="true" />
                <div className={styles.card__info}>
                  <div>
                    <p className={styles.card__name}>{DATA[who].name}</p>
                    <p className={styles.card__role}>{who === "chaithrika" ? "Model & Actress" : "Portfolio"}</p>
                  </div>
                  <span className={styles.enter} aria-hidden="true">
                    <span>Enter</span> <i>&rsaquo;</i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </nav>
      </main>

      <footer className={styles.foot}>
        <p>Bookings managed by their parents.</p>
        <p>
          Home option 03 of 10 &mdash; Clean Cards &middot;{" "}
          <Link className={styles.foot__link} href="/home-page-designs">
            All home designs
          </Link>
        </p>
      </footer>

      {/* Transition layer: the chosen card grows to fill the screen, then the route changes. */}
      {opening && d && (
        <div className={styles.xp} ref={xpRef} aria-hidden="true">
          <div className={styles.xp__media}>
            <div className={styles.card__media}>
              {opening.who === "chaithrika" ? <ChaithrikaMedia /> : <NihanPlaceholder decorative />}
            </div>
          </div>
          <div className={c("pv", d.cls)} ref={pvRef}>
            <div className={styles.pv__nav}>
              <b>{d.name}</b>
              <ul>
                {d.links.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className={styles.pv__hero}>
              <p className={styles.pv__eyebrow}>{d.eyebrow}</p>
              <p className={styles.pv__title}>{d.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
