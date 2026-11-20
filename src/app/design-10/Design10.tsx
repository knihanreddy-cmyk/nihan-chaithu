"use client";

import { useEffect, useRef, useState, useSyncExternalStore, useTransition, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePageBackground } from "@/components/designs/shared";
import { submitEnquiry } from "@/app/actions/enquiry";
import { chaithrikaDefaults, type ChaithrikaContent } from "@/lib/cms/pages/chaithrika";
import { imgProps, rich as richText } from "@/lib/cms/render";
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

/** *accent* words use the italic serif style of this design. */
const rich = (text: string) =>
  richText(text, (children: ReactNode, key: number) => (
    <span key={key} className={cx("it")}>
      {children}
    </span>
  ));
const NAME = "CHAITHRIKA".split("");

const NAV = [
  ["#modeling", "Modeling"],
  ["#acting", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
  ["#contact", "Contact"],
] as const;

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

export default function Design10({
  fontClassName,
  preview = true,
  content = chaithrikaDefaults,
}: {
  fontClassName: string;
  /** Editable copy and photos from the CMS. */
  content?: ChaithrikaContent;
  /** Preview mode (/design-10) shows the design-option footer line; the live /chaithrika page links home instead. */
  preview?: boolean;
}) {
  const ready = useHydrated();
  const reduceMotion = useReducedMotion();
  const fine = useFinePointer();
  const [chapter, setChapter] = useState<Chapter>("rose");
  usePageBackground(CHAPTER_BG[chapter]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [thanks, setThanks] = useState("");
  const [sending, startSending] = useTransition();
  const { hero, about, categories, scenes, gallery, quote, contact, footer } = content;

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
    if (preview) {
      setThanks(THANKS);
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    startSending(async () => {
      const res = await submitEnquiry("chaithrika", data);
      setThanks(res.message);
      if (res.ok) form.reset();
    });
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
          {preview ? (
            <a className={cx("nbook")} href="#contact">
              Book
            </a>
          ) : (
            <Link className={cx("nbook")} href="/" aria-label="Back to the family homepage">
              Home
            </Link>
          )}
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
            {!preview && (
              <li>
                <Link href="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>
            )}
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
            <p className={cx("kick")}>{hero.kickerRight}</p>
          </div>
          <div className={cx("stage")} ref={stageRef}>
            <h1 className={cx("name name-back")}>
              <span className={cx("sr")}>Chaithrika</span>
              <span className={cx("w")} aria-hidden="true" ref={wordRef}>
                <NameWord />
              </span>
            </h1>
            <Image
              {...imgProps(hero.image)} alt={hero.image.alt}
              className={cx("cut")}
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
              <p className={cx("lede")}>{hero.lede}</p>
              <p className={cx("sub")}>{hero.sub}</p>
              <a className={cx("cta")} href="#contact" data-magnetic="">
                <span className={cx("ci")}>{hero.cta}</span>
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
              {rich(about.statement)}
            </h2>
            <figure className={cx("about-fig mask rv")} data-cursor="img">
              <Image
                {...imgProps(about.image)} alt={about.image.alt}
                sizes="(max-width: 900px) 80vw, (max-width: 1600px) 40vw, 640px"
              />
            </figure>
            <div className={cx("about-copy rv")}>
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <ul className={cx("discs")} aria-label="Disciplines">
                {about.disciplines.map((d, i) => (
                  <li key={i}>
                    <span className={cx("it")}>{d.name}</span>
                    <small>{d.note}</small>
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
                  {categories.marquee.map((w, i) => (
                    <MarqueeItem key={i} word={w} />
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
                  {rich(categories.heading)}
                </h2>
              </div>
              <p className={cx("rv")}>{categories.intro}</p>
            </div>
            <div className={cx("cat-grid")}>
              <article className={cx("cat")} id="modeling" aria-labelledby="mod-h">
                <figure className={cx("mask rv")} data-cursor="img">
                  <Image
                    {...imgProps(categories.modeling.image)} alt={categories.modeling.image.alt}
                    sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1600px) 45vw, 720px"
                  />
                </figure>
                <h3 id="mod-h" className={cx("disp")}>
                  {categories.modeling.title}
                </h3>
                <p className={cx("kinds")}>{categories.modeling.kinds}</p>
                <p className={cx("body")}>{categories.modeling.body}</p>
              </article>
              <article className={cx("cat")} id="acting" aria-labelledby="act-h">
                <figure className={cx("mask rv")} data-cursor="img">
                  <Image
                    {...imgProps(categories.acting.image)} alt={categories.acting.image.alt}
                    sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1600px) 45vw, 720px"
                  />
                </figure>
                <h3 id="act-h" className={cx("disp")}>
                  {categories.acting.title}
                </h3>
                <p className={cx("kinds")}>{categories.acting.kinds}</p>
                <p className={cx("body")}>{categories.acting.body}</p>
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
              {rich(scenes.heading)}
            </h2>
          </div>

          <article className={cx("scene-a")} aria-labelledby="s1-h">
            <div className={cx("frame")} data-cursor="img" ref={s1FrameRef}>
              <Image {...imgProps(scenes.scene1.image)} alt={scenes.scene1.image.alt} sizes="100vw" />
            </div>
            <div className={cx("scene-cap")}>
              <span className={cx("idx")} aria-hidden="true">
                01
              </span>
              <div>
                <h3 id="s1-h">{rich(scenes.scene1.title)}</h3>
                <p>{scenes.scene1.text}</p>
              </div>
              <p className={cx("meta")}>
                {scenes.scene1.meta.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
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
                  {rich(scenes.scene2.title)}
                </h3>
                <p>{scenes.scene2.text}</p>
              </div>
              <figure className={cx("mask rv")} data-cursor="img">
                <Image
                  {...imgProps(scenes.scene2.image)} alt={scenes.scene2.image.alt}
                  sizes="(max-width: 900px) 80vw, (max-width: 1600px) 40vw, 640px"
                />
                {scenes.scene2.caption && <figcaption>{scenes.scene2.caption}</figcaption>}
              </figure>
              {(scenes.scene2.creditKicker || scenes.scene2.credit) && (
                <div className={cx("credit-line rv")}>
                  <p className={cx("kick")}>{scenes.scene2.creditKicker}</p>
                  <p className={cx("it")}>{scenes.scene2.credit}</p>
                </div>
              )}
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
                  {rich(gallery.heading)}
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
                  <p className={cx("big")}>{gallery.introBig}</p>
                  <p className={cx("small")}>{gallery.introSmall}</p>
                </li>
                {gallery.cards.map((card, i) => (
                  <li key={i} className={cx(card.tall ? "card tall" : "card")}>
                    <figure>
                      <div className={cx("ph")} data-cursor="img">
                        <Image
                          {...imgProps(card.image)} alt={card.image.alt}
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
              <Image {...imgProps(quote.image)} alt={quote.image.alt} sizes="(max-width: 900px) 75vw, (max-width: 1600px) 40vw, 640px" />
            </figure>
            <div className={cx("q-body rv")}>
              <p className={cx("kick")}>
                <span className={cx("dot")} />
                In her words
              </p>
              <blockquote>
                <p>{quote.text}</p>
                <footer>{quote.author}</footer>
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
              {rich(contact.heading)}
            </h2>
            <div className={cx("c-grid")}>
              <div className={cx("c-copy rv")}>
                {contact.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {contact.availability && <p className={cx("avail")}>{contact.availability}</p>}
              </div>
              <form className={cx("form rv")} id="enquiry" noValidate onSubmit={onSubmit}>
                <div className={cx("field")}>
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" />
                </div>
                <div className={cx("field")}>
                  <label htmlFor="f-contact">Email or phone</label>
                  <input id="f-contact" name="contact" type="text" autoComplete="email" />
                </div>
                <div className={cx("field")}>
                  <label htmlFor="f-brand">Brand / company</label>
                  <input id="f-brand" name="company" type="text" autoComplete="organization" />
                </div>
                <div className={cx("field")}>
                  <label htmlFor="f-type">Project type</label>
                  <select id="f-type" name="type" defaultValue="">
                    <option value="">Choose one</option>
                    {contact.projectTypes.map((t, i) => (
                      <option key={i}>{t}</option>
                    ))}
                  </select>
                </div>
                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
                />
                <div className={cx("field full")}>
                  <label htmlFor="f-msg">Message</label>
                  <textarea id="f-msg" name="message" rows={4} />
                </div>
                <div className={cx("f-row")}>
                  <button className={cx("cta")} type="submit" data-magnetic="" disabled={sending}>
                    <span className={cx("ci")}>{sending ? "Sending…" : contact.button}</span>
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
              {footer.instagram && (
                <li>
                  <a href={footer.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </li>
              )}
              <li>
                <a href="#contact">Book</a>
              </li>
              <li>
                <a href="#top">Back to top</a>
              </li>
              {!preview && (
                <li>
                  <Link href="/">Family home</Link>
                </li>
              )}
            </ul>
            <p>{footer.copyright}</p>
            {preview && (
              <p className={cx("foot-design")}>
                <span>Design option 10 of 10 — Ultra Premium Creative</span>
                <Link href="/designs">View all designs</Link>
              </p>
            )}
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
