"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { designImage, usePageBackground } from "@/components/designs/shared";
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

const PAPER = "#F1F0EC";
const THANKS = "Thank you — this is a design preview, so nothing was sent.";

const NAV = [
  ["#modeling", "Modeling"],
  ["#acting", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
  ["#contact", "Contact"],
] as const;

export default function Design5({ fontClassName }: { fontClassName: string }) {
  usePageBackground(PAPER);
  const ready = useHydrated();
  const rootRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [thanks, setThanks] = useState("");

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

  // reveals (image wipes + fade-ups)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = root.querySelectorAll<HTMLElement>(`.${styles.wipe}, .${styles.rv}`);
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add(styles.in));
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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // subtle parallax on offset elements
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const par = Array.from(root.querySelectorAll<HTMLElement>("[data-speed]"));
    if (reduce || !par.length) return;
    const mq = window.matchMedia("(min-width: 901px)");
    let ticking = false;
    let raf = 0;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      par.forEach((el) => {
        if (!mq.matches) {
          el.style.transform = "";
          return;
        }
        const parent = el.parentElement;
        if (!parent) return;
        const host = parent.getBoundingClientRect();
        if (host.bottom < -200 || host.top > vh + 200) return;
        const d = (host.top + host.height / 2 - vh / 2) * parseFloat(el.dataset.speed ?? "0");
        el.style.transform = `translate3d(0,${d.toFixed(1)}px,0)`;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      par.forEach((el) => (el.style.transform = ""));
    };
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setThanks(THANKS);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={rootRef} className={[styles.root, ready ? styles.ready : "", fontClassName].filter(Boolean).join(" ")}>
      <header className={cx("nav")} id="navbar">
        <div className={cx("wrap nav-in")}>
          <a className={cx("brand")} href="#top" aria-label="Chaithrika, back to cover">
            Chaithrika <span>No. 01</span>
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
          <a className={cx("btn-book")} href="#contact">
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
        {/* COVER */}
        <section className={cx("cover")} id="top" aria-label="Cover">
          <div className={cx("wrap")}>
            <div className={cx("cover-top")}>
              <span className={cx("lbl mag")}>The Runway Issue</span>
              <span className={cx("lbl")}>Model &amp; Actress</span>
              <span className={cx("lbl")}>Runway · Editorial · Commercial · Acting</span>
            </div>
            <h1 className={cx("masthead")}>
              <span className={cx("sr")}>Chaithrika — child model and actress</span>
              <svg viewBox="0 0 1000 124" aria-hidden="true" focusable="false">
                <text x="0" y="118" textLength="1000" lengthAdjust="spacingAndGlyphs">
                  CHAITHRIKA
                </text>
              </svg>
            </h1>
            <div className={cx("issue-line")}>
              <span className={cx("lbl mag")}>Issue No. 01 · 2025 · Bangalore</span>
              <span className={cx("lbl muted")}>The Portfolio Edition</span>
            </div>

            <div className={cx("cover-grid g12")}>
              <div className={cx("cl cl-left")}>
                <div className={cx("cline")}>
                  <span className={cx("lbl mag")}>Cover story</span>
                  <p className={cx("big")}>The Runway Issue</p>
                  <p className={cx("dek")}>Poise, presence and a finish to remember.</p>
                </div>
                <div className={cx("cline")}>
                  <p className={cx("mid")}>
                    IKFW Season 11 <em>— inside her first big walk</em>
                  </p>
                  <span className={cx("pg")}>p. 24</span>
                </div>
                <div className={cx("also")}>
                  <p className={cx("lbl mag")} style={{ marginBottom: 6 }}>
                    Also inside
                  </p>
                  <ul>
                    <li>Before the lights: backstage</li>
                    <li>The Lookbook, eight looks</li>
                    <li>Bookings, now open</li>
                  </ul>
                </div>
              </div>

              <figure className={cx("cover-photo")}>
                <Image
                  {...designImage("blue-gown")}
                  alt="Chaithrika in a teal-blue ball gown covered in fabric roses, one hand on her hip, beside a wooden stool against a pink studio backdrop"
                  sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1380px) 46vw, 640px"
                  preload
                />
                <figcaption className={cx("vcredit")}>
                  <b>On the cover</b> — Teal-blue rose ball gown. Studio, pink backdrop.
                </figcaption>
              </figure>

              <div className={cx("cl cl-right")}>
                <div className={cx("cline")}>
                  <span className={cx("lbl")}>The commercial</span>
                  <p className={cx("mid")}>
                    Amazon Kids Dress <em>— the campaign look</em>
                  </p>
                  <span className={cx("pg")}>p. 12</span>
                </div>
                <div className={cx("cline")}>
                  <span className={cx("lbl")}>In conversation</span>
                  <p className={cx("big")}>Modeling × Acting</p>
                  <p className={cx("dek")}>&lsquo;Both ask for presence.&rsquo;</p>
                  <span className={cx("pg")}>p. 18</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENTS */}
        <section
          className={cx("sec")}
          id="contents"
          aria-labelledby="contents-h"
          style={{ paddingTop: "clamp(24px,4vw,60px)" }}
        >
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl")}>Chaithrika</span>
              <span className={cx("lbl muted")}>Issue No. 01 · p. 02</span>
            </div>
            <div className={cx("g12")}>
              <div className={cx("contents-head")}>
                <span className={cx("lbl mag")}>In this issue</span>
                <h2 id="contents-h" className={cx("disp")}>
                  <em>Contents</em>
                </h2>
                <p>A portfolio in eight parts: the runway, the camera, the stage, and the quiet minutes in between.</p>
              </div>
              <ol className={cx("toc")}>
                {(
                  [
                    ["#about", "04", "The Cover Story", "Presence, in every frame", "Profile"],
                    ["#modeling", "12", "Modeling", "Runway, editorial and fashion campaigns", "Feature"],
                    ["#acting", "18", "Acting", "Screen, stage and performance", "Feature"],
                    ["#work", "24", "The Walk", "India Kids Fashion Week, Season 11", "Runway"],
                    ["#pinnacle", "32", "The Campaign", "Pinnacle Business Park, 2024", "Brand"],
                    ["#backstage", "38", "Before the Lights", "Backstage at the mirror", "Diary"],
                    ["#lookbook", "44", "The Lookbook", "Eight looks, one presence", "Gallery"],
                    ["#contact", "52", "Bookings", "Let’s create something beautiful together", "Contact"],
                  ] as const
                ).map(([href, pg, t, sub, sec]) => (
                  <li key={href}>
                    <a href={href}>
                      <span className={cx("pg")}>{pg}</span>
                      <span className={cx("t")}>
                        {t}
                        <em>{sub}</em>
                      </span>
                      <span className={cx("sec-n")}>{sec}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className={cx("sec")} id="about" aria-labelledby="about-h" style={{ paddingTop: 0 }}>
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl mag")}>The Cover Story</span>
              <span className={cx("lbl muted")}>p. 04</span>
            </div>
            <div className={cx("g12")}>
              <figure className={cx("about-fig fig wipe")}>
                <Image
                  {...designImage("floral-lehenga")}
                  alt="Chaithrika mid-twirl in a maroon embellished top and a cream floral skirt that flares out, against a pink studio backdrop"
                  sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1380px) 48vw, 660px"
                />
                <figcaption>
                  <b>Look</b> — Maroon embellished top, cream floral skirt, caught mid-twirl.
                </figcaption>
              </figure>
              <div className={cx("about-copy")}>
                <span className={cx("lbl")}>Profile</span>
                <h2 id="about-h" className={cx("disp")}>
                  Presence, <em>in every frame.</em>
                </h2>
                <p className={cx("standfirst")}>
                  Runway, editorial, commercial and acting: an introduction to the girl on the cover.
                </p>
                <div className={cx("body")}>
                  <p className={cx("dropcap")}>
                    From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence,
                    creativity, and expressive performance to every brief. Her work blends clean camera presence with
                    a natural sense of movement and story.
                  </p>
                  <p>
                    Whether the brief calls for couture on a runway or a character in a scene, the approach stays the
                    same: listen closely, find the story inside the look, and let it move. It is why a twirl in a
                    studio reads as joy, and a runway turn reads as quiet certainty.
                  </p>
                </div>
              </div>
              <div className={cx("disc rv")}>
                <h3 className={cx("lbl mag")}>Disciplines</h3>
                <ul>
                  <li>
                    <b>Runway</b>
                    <span>Poise, pace and a clean finish</span>
                  </li>
                  <li>
                    <b>Editorial</b>
                    <span>Stillness that tells a story</span>
                  </li>
                  <li>
                    <b>Commercial</b>
                    <span>Warmth that sells the look</span>
                  </li>
                  <li>
                    <b>Acting</b>
                    <span>Expression, timing and play</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MODELING / ACTING */}
        <section className={cx("sec")} aria-labelledby="two-h" style={{ paddingTop: 0 }}>
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl mag")}>Features</span>
              <span className={cx("lbl muted")}>pp. 12–23</span>
            </div>
            <div className={cx("spread-head")}>
              <h2 id="two-h" className={cx("disp")}>
                Two ways <em>to tell a story.</em>
              </h2>
              <p>
                One asks her to carry a look. The other asks her to carry a character. Both, in her words, ask for
                presence.
              </p>
            </div>

            <article className={cx("cat g12")} id="modeling" aria-labelledby="mod-h">
              <figure className={cx("cat-fig fig wipe")}>
                <Image
                  {...designImage("orange-flowers")}
                  alt="Chaithrika standing full length with hands on hips in an orange dress decorated with three-dimensional flowers, against a grey studio backdrop"
                  sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 900px) 64vw, (max-width: 1380px) 40vw, 540px"
                />
                <figcaption>
                  <b>Look</b> — Orange dress, sculpted 3D flowers. Studio, grey.
                </figcaption>
              </figure>
              <div className={cx("cat-copy rv")}>
                <span className={cx("lbl")}>Part one · p. 12</span>
                <h3 id="mod-h" className={cx("disp")}>
                  Mod<em>eling</em>
                </h3>
                <p className={cx("kinds")}>Runway · Editorial · Fashion campaigns</p>
                <p className={cx("body-p")}>
                  Clean lines on the runway, considered stillness for the editorial frame, and the kind of easy
                  confidence a campaign needs to make clothes feel alive. Credits include the IKFW Season 11 runway, a
                  brand shoot at Pinnacle Business Park, and Amazon Kids Dress.
                </p>
              </div>
            </article>

            <article className={cx("cat rev g12")} id="acting" aria-labelledby="act-h">
              <figure className={cx("cat-fig fig wipe")}>
                <Image
                  {...designImage("saree")}
                  alt="Chaithrika outdoors in an orange and green traditional outfit with jewellery, leaning against a tree and looking upward"
                  sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 900px) 64vw, (max-width: 1380px) 40vw, 540px"
                />
                <figcaption>
                  <b>Look</b> — Orange and green traditional wear, temple jewellery. Outdoors.
                </figcaption>
              </figure>
              <div className={cx("cat-copy rv")}>
                <span className={cx("lbl")}>Part two · p. 18</span>
                <h3 id="act-h" className={cx("disp")}>
                  <em>Act</em>ing
                </h3>
                <p className={cx("kinds")}>Screen · Stage · Performance</p>
                <p className={cx("body-p")}>
                  A face that holds a thought before it speaks. On screen or on stage, she brings the same instinct she
                  brings to a shoot: find the feeling first, and the performance follows.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* THE WALK / IKFW */}
        <section className={cx("sec")} id="work" aria-labelledby="walk-h" style={{ paddingTop: 0 }}>
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl mag")}>Runway</span>
              <span className={cx("lbl muted")}>p. 24</span>
            </div>
            <div className={cx("g12")}>
              <h2 id="walk-h" className={cx("walk-title disp")}>
                The <em>Walk</em>
              </h2>
              <div className={cx("walk-copy rv")}>
                <span className={cx("lbl mag")}>India Kids Fashion Week</span>
                <h3>Season 11, and a runway finish to remember.</h3>
                <p>
                  A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable
                  runway finish.
                </p>
                <dl className={cx("credits")}>
                  <div>
                    <dt>Event</dt>
                    <dd>India Kids Fashion Week, Season 11</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>Runway show</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>December 18, 2024</dd>
                  </div>
                  <div>
                    <dt>Look</dt>
                    <dd>Kalamkari crop top, mint striped lehenga</dd>
                  </div>
                </dl>
              </div>
              <figure className={cx("walk-fig")}>
                <div className={cx("fig wipe")}>
                  <Image
                    {...designImage("runway")}
                    alt="Chaithrika on the IKFW Season 11 runway in a kalamkari crop top and mint striped lehenga, under stage lights with the audience watching"
                    sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1380px) 64vw, 880px"
                  />
                </div>
                <div className={cx("walk-date")} data-speed="-0.06">
                  <span className={cx("lbl mag")}>On the runway</span>
                  <b>18.12.24</b>
                </div>
                <figcaption>
                  <b>Look</b> — Kalamkari crop top, mint striped lehenga. IKFW Season 11.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* PINNACLE */}
        <section className={cx("sec")} id="pinnacle" aria-labelledby="pin-h" style={{ paddingTop: 0 }}>
          <div className={cx("wrap")}>
            <div className={cx("pin g12")}>
              <h2 id="pin-h" className={cx("disp")}>
                Pinnacle <em>Business Park</em>
              </h2>
              <div className={cx("pin-meta")}>
                <span className={cx("lbl mag")}>The Campaign · p. 32</span>
                <dl className={cx("pin-meta-dl")}>
                  <div>
                    <dt>Brief</dt>
                    <dd>Brand photoshoot</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>Bangalore</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>2024</dd>
                  </div>
                </dl>
              </div>
              <div className={cx("pin-body rv")}>
                <p className={cx("dropcap")}>
                  A brand campaign shot at one of Bangalore&rsquo;s premier business destinations, balancing couture,
                  confidence, and polished camera presence.
                </p>
                <p>
                  Architecture is a demanding co-star: all hard lines and cool light. The work of a shoot like this is
                  to hold her own against it, bringing softness, story and scale to a setting built for boardrooms, and
                  letting the couture do the talking.
                </p>
                <p>
                  Paired with her commercial work for Amazon Kids Dress, it rounds out a portfolio that moves easily
                  between the runway and the campaign frame.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className={cx("sec")} aria-label="In her words" style={{ paddingTop: 0 }}>
          <div className={cx("wrap")}>
            <div className={cx("quote g12")}>
              <figure className={cx("quote-fig fig wipe")}>
                <Image
                  {...designImage("garden")}
                  alt="Chaithrika in a black and gold traditional half-saree among flowering plants, smiling shyly"
                  sizes="(max-width: 560px) 80vw, (max-width: 900px) 56vw, (max-width: 1380px) 32vw, 440px"
                />
                <figcaption>
                  <b>Look</b> — Black and gold half-saree. In the garden.
                </figcaption>
              </figure>
              <blockquote className={cx("quote-bq rv")}>
                <span className={cx("mark")} aria-hidden="true">
                  &ldquo;
                </span>
                <p>Modeling and acting both ask for presence. I love the challenge each one brings.</p>
                <footer>
                  <span className={cx("lbl")}>Chaithrika, in her words</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* BACKSTAGE */}
        <section className={cx("sec bts")} id="backstage" aria-labelledby="bts-h">
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl")}>Behind the scenes</span>
              <span className={cx("lbl muted")}>p. 38</span>
            </div>
            <div className={cx("g12")}>
              <figure className={cx("bts-fig fig wipe")}>
                <Image
                  {...designImage("backstage")}
                  alt="Backstage at IKFW, Chaithrika wearing an event lanyard looks into a makeup mirror framed by glowing bulbs"
                  sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1380px) 56vw, 780px"
                />
                <figcaption>
                  <b>Backstage</b> — IKFW Season 11. Lanyard on, bulbs lit.
                </figcaption>
              </figure>
              <div className={cx("bts-copy rv")}>
                <span className={cx("lbl mag")}>Diary</span>
                <h2 id="bts-h" className={cx("disp")}>
                  Before the <em>lights.</em>
                </h2>
                <p>
                  A bulb-lit mirror, a lanyard around her neck, and one last look before the walk. The minutes
                  backstage are part of the performance too.
                </p>
                <p>
                  This is where the look is checked, a breath is taken, and the runway is walked once in the mind
                  before it is walked for real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOOKBOOK */}
        <section className={cx("sec")} id="lookbook" aria-labelledby="lb-h">
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl mag")}>Gallery</span>
              <span className={cx("lbl muted")}>p. 44</span>
            </div>
            <div className={cx("lb-head g12")}>
              <h2 id="lb-h" className={cx("disp")}>
                The <em>Lookbook</em>
              </h2>
              <p>
                Eight looks across studio, garden and street. Tulle and silk, sweatshirts and sequins, with the same
                easy presence in each.
              </p>
            </div>
            <div className={cx("lb g12")}>
              <figure className={cx("l1 fig wipe")}>
                <Image
                  {...designImage("white-chair")}
                  alt="Chaithrika in a white tulle dress seated on a white folding chair against a pale backdrop with soft pink hearts"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 32vw, 440px"
                />
                <figcaption>
                  <b>Look 01</b> White tulle, folding chair
                </figcaption>
              </figure>
              <figure className={cx("l2 fig wipe")} data-speed="-0.05">
                <Image
                  {...designImage("fairy")}
                  alt="Chaithrika in a white tulle dress with fairy wings, standing full length against a grey studio backdrop"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 24vw, 330px"
                />
                <figcaption>
                  <b>Look 02</b> Tulle and fairy wings
                </figcaption>
              </figure>
              <figure className={cx("l3 fig wipe")}>
                <Image
                  {...designImage("green-gown")}
                  alt="Chaithrika outdoors holding out the wide skirt of a dark green gown, wearing a tiara, with palm leaves behind"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 24vw, 330px"
                />
                <figcaption>
                  <b>Look 03</b> Emerald gown, tiara
                </figcaption>
              </figure>
              <figure className={cx("l4 fig wipe")}>
                <Image
                  {...designImage("navy-ethnic")}
                  alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 24vw, 330px"
                />
                <figcaption>
                  <b>Look 04</b> Navy embroidery, hibiscus
                </figcaption>
              </figure>
              <figure className={cx("l5 fig wipe")} data-speed="-0.04">
                <Image
                  {...designImage("park")}
                  alt="Chaithrika in a yellow t-shirt with an owl backpack on a red park bench, photographed from a low angle"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 32vw, 440px"
                />
                <figcaption>
                  <b>Look 05</b> Yellow tee, owl backpack
                </figcaption>
              </figure>
              <figure className={cx("l6 fig wipe")}>
                <Image
                  {...designImage("yellow-jeep")}
                  alt="Chaithrika in a yellow butterfly sweatshirt stepping out of a jeep, colour against a black and white background"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 16vw, 220px"
                />
                <figcaption>
                  <b>Look 06</b> Butterfly sweatshirt
                </figcaption>
              </figure>
              <figure className={cx("l7 fig wipe")}>
                <Image
                  {...designImage("red-peplum")}
                  alt="Chaithrika smiling in a red brocade peplum top and pink skirt against a pink studio backdrop"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 40vw, 550px"
                />
                <figcaption>
                  <b>Look 07</b> Red brocade peplum
                </figcaption>
              </figure>
              <figure className={cx("l8 fig wipe")} data-speed="-0.05">
                <Image
                  {...designImage("teal-lehenga")}
                  alt="Chaithrika in a green blouse, orange silk lehenga and teal and yellow dupatta, looking off to the side against a grey backdrop"
                  sizes="(max-width: 900px) 50vw, (max-width: 1380px) 32vw, 440px"
                />
                <figcaption>
                  <b>Look 08</b> Orange silk lehenga, teal dupatta
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className={cx("sec")} id="contact" aria-labelledby="contact-h" style={{ paddingTop: 0 }}>
          <div className={cx("wrap")}>
            <div className={cx("folio")}>
              <span className={cx("lbl mag")}>Bookings</span>
              <span className={cx("lbl muted")}>p. 52</span>
            </div>
            <div className={cx("g12")}>
              <div className={cx("contact-copy")}>
                <span className={cx("lbl")}>Runway · Editorial · Commercial · Acting</span>
                <h2 id="contact-h" className={cx("disp")}>
                  Let&rsquo;s create something <em>beautiful</em> together.
                </h2>
                <p>
                  Chaithrika&rsquo;s parents handle every booking personally. Tell us about the brief, the dates and
                  the look you have in mind, and we will come back to you.
                </p>
                <p className={cx("avail lbl")}>Available for bookings</p>
              </div>
              <form className={cx("form")} id="enquiry" noValidate onSubmit={onSubmit}>
                <div className={cx("field")}>
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" required />
                </div>
                <div className={cx("field")}>
                  <label htmlFor="f-brand">Brand / company</label>
                  <input id="f-brand" name="company" type="text" autoComplete="organization" />
                </div>
                <div className={cx("field full")}>
                  <label htmlFor="f-type">Project type</label>
                  <select id="f-type" name="type" defaultValue="">
                    <option value="">Select a project type</option>
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
                <div className={cx("submit-row")}>
                  <button className={cx("submit")} type="submit">
                    Send enquiry
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

      <footer className={cx("foot")}>
        <div className={cx("wrap g12")}>
          <p className={cx("foot-name disp")}>
            <em>Chaithrika</em>
          </p>
          <div className={cx("foot-cols")}>
            <p className={cx("lbl muted")}>Issue No. 01 · 2025 · Bangalore</p>
            <ul>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#contact">Book</a>
              </li>
              <li>
                <a href="#top">Back to cover</a>
              </li>
            </ul>
          </div>
          <div className={cx("foot-base")}>
            <span className={cx("lbl muted")}>&copy; Chaithrika. Child model &amp; actress, India.</span>
            <span className={cx("foot-design")}>
              <span className={cx("lbl muted")}>Design option 05 of 10 — Editorial / Magazine</span>
              <Link className={cx("foot-all")} href="/designs">
                View all designs
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
