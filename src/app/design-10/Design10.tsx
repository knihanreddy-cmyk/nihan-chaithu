"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { designImage, usePageBackground, type DesignImageName } from "@/components/designs/shared";
import styles from "./design.module.css";

/** Map a space-separated list of template class names onto the CSS Module. */
function cx(names: string) {
  return names
    .split(" ")
    .map((n) => styles[n])
    .filter(Boolean)
    .join(" ");
}

const noopSubscribe = () => () => {};
/** false during SSR and hydration, true once the client has taken over. */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const REDUCE_Q = "(prefers-reduced-motion: reduce)";
const FINE_Q = "(pointer: fine)";
const subscribeTo = (query: string) => (cb: () => void) => {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const subscribeReduce = subscribeTo(REDUCE_Q);
const subscribeFine = subscribeTo(FINE_Q);
const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_Q).matches,
    () => false,
  );
const useFinePointer = () =>
  useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE_Q).matches,
    () => false,
  );

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Chapter = "rose" | "marigold" | "mint" | "night";
const CHAPTER_BG: Record<Chapter, string> = {
  rose: "#E3769F",
  marigold: "#EA5F14",
  mint: "#BFE6D6",
  night: "#0C0C0E",
};
const isChapter = (v: string | undefined): v is Chapter => !!v && v in CHAPTER_BG;

const THANKS = "Thank you — this is a design preview, so nothing was sent.";
const NAME = "CHAITHRIKA".split("");

const NAV = [
  ["#modeling", "Modeling"],
  ["#acting", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
  ["#contact", "Contact"],
] as const;

type Card = { img: DesignImageName; tall?: boolean; alt: string; title: string; where: string };
const CARDS: Card[] = [
  {
    img: "white-chair",
    alt: "Chaithrika in a white tulle dress seated on a white folding chair, with soft pink hearts on the backdrop",
    title: "White tulle",
    where: "Studio",
  },
  {
    img: "fairy",
    tall: true,
    alt: "Chaithrika in a white tulle dress with fairy wings against a grey studio backdrop",
    title: "Fairy wings",
    where: "Studio",
  },
  {
    img: "green-gown",
    alt: "Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind her",
    title: "Emerald gown",
    where: "Outdoors",
  },
  {
    img: "navy-ethnic",
    tall: true,
    alt: "Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds",
    title: "Navy & hibiscus",
    where: "Outdoors",
  },
  {
    img: "red-peplum",
    alt: "Chaithrika smiling in a red brocade peplum top and pink skirt against a pink backdrop",
    title: "Red brocade",
    where: "Studio",
  },
  {
    img: "garden",
    tall: true,
    alt: "Chaithrika in a black and gold half-saree in a flowering garden, smiling shyly",
    title: "Black & gold",
    where: "Garden",
  },
  {
    img: "yellow-jeep",
    alt: "Chaithrika in a yellow butterfly sweatshirt stepping out of a jeep, colour against a black and white background",
    title: "Butterfly yellow",
    where: "Street",
  },
  {
    img: "park",
    tall: true,
    alt: "Chaithrika in a yellow tee with an owl backpack on a red park bench, from a low angle",
    title: "Park day",
    where: "Lifestyle",
  },
  {
    img: "backstage",
    alt: "Backstage at IKFW, Chaithrika with an event lanyard looking into a bulb-lit makeup mirror",
    title: "Before the lights",
    where: "Backstage, IKFW",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13L13 3M5 3h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function NameWord() {
  return (
    <>
      {NAME.map((l, i) => (
        <span key={i} className={cx("l")} style={{ "--i": i } as CSSProperties}>
          {l}
        </span>
      ))}
    </>
  );
}

/** Custom dot + trailing ring. Only mounted for fine pointers. */
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const reduce = window.matchMedia(REDUCE_Q).matches;
    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100,
      raf = 0;
    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    };
    place(dot, mx, my);
    place(ring, rx, ry);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      place(dot, mx, my);
      if (reduce) {
        rx = mx;
        ry = my;
        place(ring, rx, ry);
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const field = !!t.closest("input, textarea, select");
      ring.classList.toggle(styles["is-hidden"], field);
      dot.classList.toggle(styles["is-hidden"], field);
      ring.classList.toggle(styles["is-img"], !!t.closest('[data-cursor="img"]'));
      ring.classList.toggle(styles["is-link"], !!t.closest("a, button, label"));
    };
    const onLeave = () => {
      ring.classList.add(styles["is-hidden"]);
      dot.classList.add(styles["is-hidden"]);
    };
    const onEnter = () => {
      ring.classList.remove(styles["is-hidden"]);
      dot.classList.remove(styles["is-hidden"]);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    // mouseleave/mouseenter don't fire on `document` itself; the root element gets them.
    const html = document.documentElement;
    html.addEventListener("mouseleave", onLeave);
    html.addEventListener("mouseenter", onEnter);
    if (!reduce) loop();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      html.removeEventListener("mouseleave", onLeave);
      html.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={cx("cur-dot")} aria-hidden="true" />
      <div ref={ringRef} className={cx("cur-ring")} aria-hidden="true">
        <span>View</span>
      </div>
    </>
  );
}

export default function Design10({ fontClassName }: { fontClassName: string }) {
  const ready = useHydrated();
  const reduceMotion = useReducedMotion();
  const fine = useFinePointer();
  const [chapter, setChapter] = useState<Chapter>("rose");
  usePageBackground(CHAPTER_BG[chapter]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [thanks, setThanks] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const hsRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const s1FrameRef = useRef<HTMLDivElement>(null);

  // mobile nav: Escape closes and returns focus to the toggle
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // fit the giant name to the stage width
  useEffect(() => {
    const stage = stageRef.current;
    const word = wordRef.current;
    if (!stage || !word) return;
    let alive = true;
    const fit = () => {
      if (!alive) return;
      stage.style.setProperty("--ns", "100px");
      const w = word.getBoundingClientRect().width;
      const avail = stage.clientWidth - 2 * Math.max(16, Math.min(64, window.innerWidth * 0.04));
      if (w > 0) stage.style.setProperty("--ns", `${((100 * avail) / w).toFixed(2)}px`);
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => {
      alive = false;
      window.removeEventListener("resize", fit);
    };
  }, []);

  // chapter colour follows the section crossing the middle of the viewport
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const ch = (en.target as HTMLElement).dataset.ch;
          if (en.isIntersecting && isChapter(ch)) setChapter(ch);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    root.querySelectorAll("[data-ch]").forEach((s) => cio.observe(s));
    return () => cio.disconnect();
  }, []);

  // reveals
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia(REDUCE_Q).matches;
    const rv = root.querySelectorAll<HTMLElement>(`.${styles.rv}`);
    if (reduce || !("IntersectionObserver" in window)) {
      rv.forEach((el) => el.classList.add(styles.in));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add(styles.in);
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    rv.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // pinned horizontal gallery + scene zoom
  useEffect(() => {
    const hs = hsRef.current;
    const view = viewRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    const s1 = s1FrameRef.current;
    if (!hs || !view || !track || !bar) return;
    const reduce = window.matchMedia(REDUCE_Q).matches;
    const pinMQ = window.matchMedia("(min-width: 900px)");
    const pinnedClass = styles["is-pinned"];
    let dist = 0;
    let pinned = false;
    let ticking = false;
    let raf = 0;

    const onScroll = () => {
      ticking = false;
      const vh = window.innerHeight;
      if (pinned) {
        const r = hs.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
        bar.style.setProperty("--hp", p.toFixed(4));
      }
      if (!reduce && s1) {
        const fr = s1.getBoundingClientRect();
        if (fr.bottom > 0 && fr.top < vh) {
          const q = clamp((vh - fr.top) / (vh + fr.height), 0, 1);
          s1.style.setProperty("--sc", (1.14 - q * 0.14).toFixed(4));
        }
      }
    };
    const onViewScroll = () => {
      if (pinned) return;
      const max = view.scrollWidth - view.clientWidth;
      bar.style.setProperty("--hp", max > 0 ? (view.scrollLeft / max).toFixed(4) : "0");
    };
    const setupPin = () => {
      pinned = pinMQ.matches && !reduce;
      hs.classList.toggle(pinnedClass, pinned);
      view.tabIndex = pinned ? -1 : 0;
      track.style.transform = "";
      if (pinned) {
        dist = Math.max(0, track.scrollWidth - view.clientWidth);
        hs.style.height = `${window.innerHeight + dist}px`;
      } else {
        hs.style.height = "";
        onViewScroll();
      }
      onScroll();
    };
    const onWinScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(onScroll);
      }
    };

    view.addEventListener("scroll", onViewScroll, { passive: true });
    window.addEventListener("scroll", onWinScroll, { passive: true });
    window.addEventListener("resize", setupPin);
    window.addEventListener("load", setupPin);
    setupPin();

    return () => {
      cancelAnimationFrame(raf);
      view.removeEventListener("scroll", onViewScroll);
      window.removeEventListener("scroll", onWinScroll);
      window.removeEventListener("resize", setupPin);
      window.removeEventListener("load", setupPin);
      hs.classList.remove(pinnedClass);
      hs.style.height = "";
      track.style.transform = "";
    };
  }, []);

  // magnetic buttons
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !fine || window.matchMedia(REDUCE_Q).matches) return;
    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
      const label = btn.querySelector<HTMLElement>(`.${styles.ci}`);
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transition = "transform .25s var(--e), background-color .9s var(--e), color .9s var(--e)";
        btn.style.transform = `translate3d(${(x * 0.3).toFixed(1)}px,${(y * 0.4).toFixed(1)}px,0)`;
        if (label) label.style.transform = `translate3d(${(x * 0.12).toFixed(1)}px,${(y * 0.15).toFixed(1)}px,0)`;
      };
      const onLeave = () => {
        btn.style.transition = "";
        btn.style.transform = "";
        if (label) label.style.transform = "";
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        onLeave();
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [fine]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setThanks(THANKS);
  };
  const closeMenu = () => setMenuOpen(false);

  const rootClass = [
    styles.root,
    ready ? styles.ready : "",
    ready && !reduceMotion ? styles["intro-anim"] : "",
    fine ? styles["has-cursor"] : "",
    fontClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClass} data-ch={chapter}>
      {fine && <Cursor />}

      <header className={cx("nav")}>
        <div className={cx("wrap nav-in")}>
          <a className={cx("logo")} href="#top" aria-label="Chaithrika, back to top">
            Chaithrika<i>.</i>
          </a>
          <nav aria-label="Primary">
            <ul className={cx("links")}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className={cx("nbook")} href="#contact">
            Book
          </a>
          <button
            ref={burgerRef}
            className={cx("burger")}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mnav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <nav className={cx("mnav")} id="mnav" aria-label="Mobile" hidden={!menuOpen}>
          <ul>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* CHAPTER ROSE: HERO */}
        <section className={cx("hero ch ch-rose")} id="top" data-ch="rose" aria-label="Introduction">
          <div className={cx("wrap hero-meta")}>
            <p className={cx("kick")}>
              <span className={cx("dot")} />
              Chapter 01 — Rose
            </p>
            <p className={cx("kick")}>Child model &amp; actress · India</p>
          </div>
          <div className={cx("stage")} ref={stageRef}>
            <h1 className={cx("name name-back")}>
              <span className={cx("sr")}>Chaithrika</span>
              <span className={cx("w")} aria-hidden="true" ref={wordRef}>
                <NameWord />
              </span>
            </h1>
            <Image
              {...designImage("runway-cutout")}
              className={cx("cut")}
              alt="Chaithrika in a kalamkari crop top and mint striped lehenga, her runway look from India Kids Fashion Week Season 11"
              sizes="(max-width: 700px) 76vw, 520px"
              preload
            />
            <div className={cx("name name-front")} aria-hidden="true">
              <span className={cx("w")}>
                <NameWord />
              </span>
            </div>
          </div>
          <div className={cx("wrap")}>
            <div className={cx("hero-foot")}>
              <p className={cx("lede")}>Every look is a&nbsp;scene.</p>
              <p className={cx("sub")}>
                Runway, editorial, commercial and acting. From the India Kids Fashion Week Season 11 runway to Amazon
                Kids Dress, a presence that carries the whole frame.
              </p>
              <a className={cx("cta")} href="#contact" data-magnetic="">
                <span className={cx("ci")}>Book Chaithrika</span>
                <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* CHAPTER ROSE: ABOUT */}
        <section className={cx("about ch ch-rose")} id="about" data-ch="rose" aria-labelledby="about-h">
          <div className={cx("wrap about-grid")}>
            <p className={cx("kick about-kick")}>
              <span className={cx("dot")} />
              About
            </p>
            <h2 id="about-h" className={cx("statement rv")}>
              Confidence, creativity and <span className={cx("it")}>expressive performance</span>, brought to every
              single brief.
            </h2>
            <figure className={cx("about-fig mask rv")} data-cursor="img">
              <Image
                {...designImage("floral-lehenga")}
                alt="Chaithrika mid-twirl in a maroon embellished top and cream floral skirt against a pink studio backdrop"
                sizes="(max-width: 900px) 80vw, (max-width: 1600px) 40vw, 640px"
              />
            </figure>
            <div className={cx("about-copy rv")}>
              <p>
                From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence, creativity,
                and expressive performance to every brief. Her work blends clean camera presence with a natural sense
                of movement and story.
              </p>
              <p>
                A twirl in the studio, a turn at the end of a runway, a glance held a beat longer for the camera: each
                is treated as a scene with a beginning, a feeling and a finish.
              </p>
              <ul className={cx("discs")} aria-label="Disciplines">
                {(
                  [
                    ["Runway", "Movement"],
                    ["Editorial", "Stillness"],
                    ["Commercial", "Warmth"],
                    ["Acting", "Story"],
                  ] as const
                ).map(([d, s]) => (
                  <li key={d}>
                    <span className={cx("it")}>{d}</span>
                    <small>{s}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CHAPTER MARIGOLD */}
        <section className={cx("ch ch-marigold")} data-ch="marigold" aria-labelledby="cats-h">
          <div className={cx("marquee")}>
            <div className={cx("mq-track")}>
              {[false, true].map((dup) => (
                <div key={String(dup)} className={cx("mq-group")} aria-hidden={dup || undefined}>
                  {["Runway", "Editorial", "Commercial", "Acting", "Screen", "Stage", "Performance"].map((w) => (
                    <MarqueeItem key={w} word={w} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={cx("cats wrap")}>
            <div className={cx("cats-head")}>
              <div>
                <p className={cx("kick")}>
                  <span className={cx("dot")} />
                  Chapter 02 — Marigold
                </p>
                <h2 id="cats-h" className={cx("disp")}>
                  Two stages
                </h2>
              </div>
              <p className={cx("rv")}>
                One asks her to carry a look. The other asks her to carry a character. Both, in her words, ask for
                presence.
              </p>
            </div>
            <div className={cx("cat-grid")}>
              <article className={cx("cat")} id="modeling" aria-labelledby="mod-h">
                <figure className={cx("mask rv")} data-cursor="img">
                  <Image
                    {...designImage("orange-flowers")}
                    alt="Chaithrika standing with hands on hips in an orange dress with three-dimensional flowers, against a grey studio backdrop"
                    sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1600px) 45vw, 720px"
                  />
                </figure>
                <h3 id="mod-h" className={cx("disp")}>
                  Modeling
                </h3>
                <p className={cx("kinds")}>Runway · Editorial · Fashion campaigns</p>
                <p className={cx("body")}>
                  Poise on the runway, stillness for the editorial frame, and the easy warmth a campaign needs to make
                  clothes feel alive.
                </p>
              </article>
              <article className={cx("cat")} id="acting" aria-labelledby="act-h">
                <figure className={cx("mask rv")} data-cursor="img">
                  <Image
                    {...designImage("saree")}
                    alt="Chaithrika in an orange and green traditional outfit with jewellery, leaning on a tree and looking up"
                    sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1600px) 45vw, 720px"
                  />
                </figure>
                <h3 id="act-h" className={cx("disp")}>
                  Acting
                </h3>
                <p className={cx("kinds")}>Screen · Stage · Performance</p>
                <p className={cx("body")}>
                  A face that holds a thought before it speaks. Find the feeling first, and the performance follows.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CHAPTER MINT: SCENES */}
        <section className={cx("scenes ch ch-mint")} id="work" data-ch="mint" aria-labelledby="work-h">
          <div className={cx("wrap scenes-head")}>
            <p className={cx("kick")}>
              <span className={cx("dot")} />
              Chapter 03 — Mint
            </p>
            <h2 id="work-h" className={cx("disp rv")}>
              Featured <span className={cx("it")}>scenes</span>
            </h2>
          </div>

          <article className={cx("scene-a")} aria-labelledby="s1-h">
            <div className={cx("frame")} data-cursor="img" ref={s1FrameRef}>
              <Image
                {...designImage("runway")}
                alt="Chaithrika walking the India Kids Fashion Week Season 11 runway in a kalamkari crop top and mint striped lehenga, under stage lights with the audience watching"
                sizes="100vw"
              />
            </div>
            <div className={cx("scene-cap")}>
              <span className={cx("idx")} aria-hidden="true">
                01
              </span>
              <div>
                <h3 id="s1-h">
                  India Kids Fashion Week <span className={cx("it")}>Season 11</span>
                </h3>
                <p>
                  A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable
                  runway finish.
                </p>
              </div>
              <p className={cx("meta")}>
                Runway show
                <br />
                Dec 18, 2024
                <br />
                Kalamkari &amp; mint
              </p>
            </div>
          </article>

          <div className={cx("wrap")}>
            <article className={cx("scene-b")} aria-labelledby="s2-h">
              <div className={cx("copy rv")}>
                <span className={cx("idx")} aria-hidden="true">
                  02
                </span>
                <h3 id="s2-h" className={cx("disp")}>
                  Pinnacle Business Park <span className={cx("it")}>Brand photoshoot, 2024</span>
                </h3>
                <p>
                  A brand campaign shot at one of Bangalore&rsquo;s premier business destinations, balancing couture,
                  confidence, and polished camera presence.
                </p>
              </div>
              <figure className={cx("mask rv")} data-cursor="img">
                <Image
                  {...designImage("teal-lehenga")}
                  alt="Chaithrika in a green blouse, orange silk lehenga and teal and yellow dupatta, looking off to one side"
                  sizes="(max-width: 900px) 80vw, (max-width: 1600px) 40vw, 640px"
                />
                <figcaption>Studio portrait — orange silk lehenga, teal dupatta</figcaption>
              </figure>
              <div className={cx("credit-line rv")}>
                <p className={cx("kick")}>Also in the credits</p>
                <p className={cx("it")}>Amazon Kids Dress — commercial</p>
              </div>
            </article>
          </div>
        </section>

        {/* CHAPTER NIGHT: GALLERY */}
        <section className={cx("hs ch ch-night")} id="gallery" data-ch="night" aria-labelledby="gal-h" ref={hsRef}>
          <div className={cx("hs-sticky")}>
            <div className={cx("wrap hs-top")}>
              <div>
                <p className={cx("kick")}>
                  <span className={cx("dot")} />
                  Chapter 04 — Night
                </p>
                <h2 id="gal-h" className={cx("disp")}>
                  The <span className={cx("it")}>wardrobe</span>
                </h2>
              </div>
              <div className={cx("hs-hint")}>
                <span>
                  <span className={cx("hint-scroll")}>Scroll</span>
                  <span className={cx("hint-swipe")}>Swipe</span>
                </span>
                <span className={cx("bar")} ref={barRef}>
                  <i />
                </span>
              </div>
            </div>
            <div
              className={cx("hs-view")}
              id="hsview"
              tabIndex={0}
              aria-label="Gallery of looks, scrolls horizontally"
              ref={viewRef}
            >
              <ul className={cx("hs-track")} id="hstrack" ref={trackRef}>
                <li className={cx("card intro")}>
                  <p className={cx("big")}>Nine looks. One presence.</p>
                  <p className={cx("small")}>
                    Tulle and silk, sweatshirts and sequins: studio, garden, street and backstage.
                  </p>
                </li>
                {CARDS.map((card) => (
                  <li key={card.img} className={cx(card.tall ? "card tall" : "card")}>
                    <figure>
                      <div className={cx("ph")} data-cursor="img">
                        <Image
                          {...designImage(card.img)}
                          alt={card.alt}
                          sizes="(max-width: 472px) 72vw, (max-width: 899px) 340px, 460px"
                        />
                      </div>
                      <figcaption className={cx("gcap")}>
                        {card.title}
                        <small>{card.where}</small>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CHAPTER ROSE (reprise): QUOTE */}
        <section className={cx("quote ch ch-rose")} data-ch="rose" aria-label="In her words">
          <div className={cx("wrap q-grid")}>
            <figure className={cx("q-fig mask rv")} data-cursor="img">
              <Image
                {...designImage("blue-gown")}
                alt="Chaithrika in a teal-blue rose ball gown with a hand on her hip, beside a wooden stool against a pink backdrop"
                sizes="(max-width: 900px) 75vw, (max-width: 1600px) 40vw, 640px"
              />
            </figure>
            <div className={cx("q-body rv")}>
              <p className={cx("kick")}>
                <span className={cx("dot")} />
                In her words
              </p>
              <blockquote>
                <p>Modeling and acting both ask for presence. I love the challenge each one brings.</p>
                <footer>Chaithrika</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* CHAPTER NIGHT: CONTACT */}
        <section className={cx("contact ch ch-night")} id="contact" data-ch="night" aria-labelledby="contact-h">
          <div className={cx("wrap")}>
            <p className={cx("kick")}>
              <span className={cx("dot")} />
              Final chapter — Bookings
            </p>
            <h2 id="contact-h" className={cx("disp rv")}>
              Let&rsquo;s create something <span className={cx("it")}>beautiful</span> together.
            </h2>
            <div className={cx("c-grid")}>
              <div className={cx("c-copy rv")}>
                <p>
                  Casting a runway show, an editorial, a campaign or a role? Chaithrika&rsquo;s parents handle every
                  booking personally.
                </p>
                <p>Share the brief, the dates and the feeling you are after.</p>
                <p className={cx("avail")}>Available for bookings</p>
              </div>
              <form className={cx("form rv")} id="enquiry" noValidate onSubmit={onSubmit}>
                <div className={cx("field")}>
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" />
                </div>
                <div className={cx("field")}>
                  <label htmlFor="f-brand">Brand / company</label>
                  <input id="f-brand" name="company" type="text" autoComplete="organization" />
                </div>
                <div className={cx("field full")}>
                  <label htmlFor="f-type">Project type</label>
                  <select id="f-type" name="type" defaultValue="">
                    <option value="">Choose one</option>
                    <option>Runway show</option>
                    <option>Editorial shoot</option>
                    <option>Brand or commercial campaign</option>
                    <option>Film or screen</option>
                    <option>Stage or live event</option>
                    <option>Something else</option>
                  </select>
                </div>
                <div className={cx("field full")}>
                  <label htmlFor="f-msg">Message</label>
                  <textarea id="f-msg" name="message" rows={4} />
                </div>
                <div className={cx("f-row")}>
                  <button className={cx("cta")} type="submit" data-magnetic="">
                    <span className={cx("ci")}>Book Chaithrika</span>
                    <Arrow />
                  </button>
                  <p className={cx("thanks")} id="f-thanks" role="status" aria-live="polite">
                    {thanks}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className={cx("foot ch ch-night")} data-ch="night">
        <div className={cx("wrap")}>
          <p className={cx("foot-word disp")} aria-hidden="true">
            Chaithrika
          </p>
          <div className={cx("foot-row")}>
            <ul>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#contact">Book</a>
              </li>
              <li>
                <a href="#top">Back to top</a>
              </li>
            </ul>
            <p>&copy; Chaithrika · Child model &amp; actress, India</p>
            <p className={cx("foot-design")}>
              <span>Design option 10 of 10 — Ultra Premium Creative</span>
              <Link href="/designs">View all designs</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MarqueeItem({ word }: { word: string }) {
  return (
    <>
      <span>{word}</span>
      <b />
    </>
  );
}
