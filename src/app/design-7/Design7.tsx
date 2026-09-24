"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./design.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: string[]) => names.map((n) => styles[n]).join(" ");

const MARQUEE_WORDS = ["Runway", "Editorial", "Commercial", "Acting", "Runway", "Editorial", "Commercial", "Acting"];

const NAV = [
  { href: "#modeling", label: "Modeling", sub: "Runway / Editorial" },
  { href: "#acting", label: "Acting", sub: "Screen / Stage" },
  { href: "#work", label: "Work", sub: "IKFW / Pinnacle" },
  { href: "#about", label: "About", sub: "Bio" },
  { href: "#contact", label: "Contact", sub: "Enquire" },
];

const THANKS = "Thank you — this is a design preview, so nothing was sent.";

function Arrow() {
  return (
    <span className={styles.arr} aria-hidden="true">
      &rarr;
    </span>
  );
}

export default function Design7({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#FFFFFF");

  const rootRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLHeadingElement>(null);
  const fitLineRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  /* Fit the giant wordmarks (CHAI/THRIKA and the footer line) to their container width. */
  useEffect(() => {
    const h1 = fitRef.current;
    const line = fitLineRef.current;
    if (!h1 || !line) return;
    const heroBox = h1.parentElement;
    const footBox = line.parentElement;
    if (!heroBox || !footBox) return;

    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const w = heroBox.clientWidth;
      if (w) {
        h1.style.fontSize = "100px";
        let max = 0;
        h1.querySelectorAll("span").forEach((s) => {
          max = Math.max(max, s.getBoundingClientRect().width);
        });
        if (max) h1.style.fontSize = `${((100 * w) / max) * 0.995}px`;
      }
      const lw = footBox.clientWidth;
      if (lw) {
        line.style.fontSize = "100px";
        const sw = line.getBoundingClientRect().width;
        if (sw) line.style.fontSize = `${((100 * lw) / sw) * 0.995}px`;
      }
    };

    fit();

    // Re-fit once web fonts are in (Archivo at wdth 125 is much wider than the fallback).
    const fonts = document.fonts;
    if (fonts) {
      fonts.ready.then(fit);
      fonts.addEventListener("loadingdone", fit);
    }

    // Re-fit when either container changes width (window resize, scrollbar, zoom).
    let raf = 0;
    const widths = new Map<Element, number>();
    const ro = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (widths.get(entry.target) !== width) {
          widths.set(entry.target, width);
          changed = true;
        }
      }
      if (changed) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(fit);
      }
    });
    ro.observe(heroBox);
    ro.observe(footBox);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);

  /* Mobile menu: Escape closes (and returns focus), widening past the breakpoint closes. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  /* Scroll reveals + scroll-linked geometry (--p runs -1..1 as an element crosses the viewport). */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    if (!reduce && "IntersectionObserver" in window) {
      root.classList.add(styles.ready);
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.setAttribute("data-in", "");
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
      );
      root.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
      cleanups.push(() => {
        io.disconnect();
        root.classList.remove(styles.ready);
      });
    }

    if (!reduce) {
      const spins = Array.from(root.querySelectorAll<HTMLElement>("[data-spin]"));
      let ticking = false;
      let raf = 0;
      const update = () => {
        const vh = window.innerHeight;
        spins.forEach((el) => {
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const p = Math.max(-1, Math.min(1, (mid - vh / 2) / (vh / 2 + r.height / 2)));
          el.style.setProperty("--p", (-p).toFixed(3));
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          raf = requestAnimationFrame(update);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      update();
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(raf);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMsg(THANKS);
    e.currentTarget.reset();
  };

  const marqueeList = (
    <ul>
      {MARQUEE_WORDS.map((word, i) => (
        <li key={i}>
          {word}
          <span className={styles.dot} />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={rootRef} className={`${styles.root} ${fontClassName}`}>
      <header className={styles["site-header"]} id="top">
        <div className={c("wrap", "nav")}>
          <a className={styles.brand} href="#top" aria-label="Chaithrika, home">
            <b>Chaithrika</b>
            <span className={styles.mono}>Model / Actress</span>
          </a>
          <div className={styles["nav-right"]}>
            <nav aria-label="Primary">
              <ul className={styles["nav-links"]}>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <a className={c("btn", "book")} href="#contact">
              Book <Arrow />
            </a>
            <button
              ref={toggleRef}
              className={styles["menu-toggle"]}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-panel"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <div className={styles["mobile-panel"]} id="mobile-panel" hidden={!menuOpen}>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label} <span>{item.sub}</span>
                </a>
              </li>
            ))}
          </ul>
          <a className={styles.btn} href="#contact" onClick={closeMenu}>
            Book Chaithrika <Arrow />
          </a>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-label="Introduction">
          <div className={styles.wrap}>
            <div className={c("hero-intro", "mono")}>
              <span className={styles.tag}>
                <span className={styles.dot} aria-hidden="true" />
                Available for bookings
              </span>
              <span>Charming Chaithrika — Portfolio</span>
            </div>
            <div className={styles["hero-mark"]}>
              <h1 ref={fitRef} aria-label="Chaithrika">
                <span aria-hidden="true">Chai</span>
                <span aria-hidden="true">thrika</span>
              </h1>
              <span className={styles["hero-dot"]} data-spin aria-hidden="true" />
              <figure className={styles["hero-circle"]}>
                <Image
                  {...designImage("orange-flowers")}
                  alt="Chaithrika in an orange dress with 3D flowers, hands on hips, against a grey studio backdrop"
                  sizes="(max-width: 720px) 44vw, (max-width: 1440px) 38vw, 540px"
                  preload
                />
              </figure>
            </div>
            <dl className={c("hero-meta", "mono")}>
              <div className={styles.m1}>
                <dt>Role</dt>
                <dd>Model / Actress — India</dd>
              </div>
              <div className={styles.m2}>
                <dt>Disciplines</dt>
                <dd>Runway, Editorial, Commercial, Acting</dd>
              </div>
              <div className={styles.m3}>
                <dt>Latest runway</dt>
                <dd>IKFW Season 11 — Dec 18, 2024</dd>
              </div>
              <div className={styles.m4}>
                <dt className={styles["visually-hidden"]}>Action</dt>
                <dd>
                  <a className={styles.btn} href="#contact">
                    Book Chaithrika <Arrow />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className={styles.marquee} aria-hidden="true">
          <div className={styles["marquee-track"]}>
            {marqueeList}
            {marqueeList}
          </div>
        </div>

        <section className={styles.sec} id="about" aria-labelledby="about-title">
          <div className={styles.wrap}>
            <div className={styles["sec-top"]}>
              <p className={styles.mono}>About</p>
              <h2 id="about-title" data-reveal>
                Presence, on every brief
              </h2>
            </div>
            <div className={styles["about-grid"]}>
              <div className={styles["about-copy"]}>
                <p className={styles.statement} data-reveal>
                  From the runway at India Kids Fashion Week to <mark>Amazon Kids Dress</mark>, Chaithrika brings
                  confidence, creativity and expressive performance.
                </p>
                <div className={styles.bio} data-reveal>
                  <span className={styles.mono}>Bio</span>
                  <p>
                    From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence,
                    creativity, and expressive performance to every brief. Her work blends clean camera presence with a
                    natural sense of movement and story.
                  </p>
                </div>
              </div>
              <figure className={styles["about-photo"]} data-spin data-reveal>
                <Image
                  {...designImage("white-chair")}
                  alt="Chaithrika in a white tulle dress seated on a white folding chair against a light backdrop"
                  sizes="(max-width: 520px) 92vw, (max-width: 960px) 75vw, (max-width: 1440px) 32vw, 460px"
                />
                <figcaption className={styles.mono}>
                  <span>Editorial</span>
                  <span>Studio, white</span>
                </figcaption>
              </figure>
              <ul className={styles.disc} aria-label="Disciplines">
                <li>
                  <span className={styles.mono}>Discipline</span>
                  <div>
                    <h3>Runway</h3>
                    <p>Poise, pace and a finish that lands.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.mono}>Discipline</span>
                  <div>
                    <h3>Editorial</h3>
                    <p>Clean lines and stillness that holds the frame.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.mono}>Discipline</span>
                  <div>
                    <h3>Commercial</h3>
                    <p>Natural, warm and on brief for kids’ fashion.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.mono}>Discipline</span>
                  <div>
                    <h3>Acting</h3>
                    <p>Expressive performance for screen and stage.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.sec} aria-labelledby="cats-title" style={{ paddingTop: 0 }}>
          <div className={styles.wrap}>
            <div className={styles["sec-top"]}>
              <p className={styles.mono}>Categories</p>
              <h2 id="cats-title" data-reveal>
                Two ways to work together
              </h2>
            </div>
            <div className={styles["cats-grid"]}>
              <a className={styles.cat} id="modeling" href="#work">
                <div className={c("cat-head", "mono")}>
                  <span>Category</span>
                  <span>Photo / Runway</span>
                </div>
                <figure className={c("cat-shape", "circle")}>
                  <Image
                    {...designImage("blue-gown")}
                    alt="Chaithrika in a teal-blue rose ball gown with a hand on her hip"
                    sizes="(max-width: 720px) 78vw, (max-width: 1200px) 36vw, 440px"
                  />
                </figure>
                <div>
                  <h3>Modeling</h3>
                  <div className={c("cat-foot", "mono")}>
                    <ul>
                      <li>Runway</li>
                      <li>Editorial</li>
                      <li>Fashion campaigns</li>
                    </ul>
                    <span className={styles.go}>
                      View work <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </a>
              <a className={styles.cat} id="acting" href="#contact">
                <div className={c("cat-head", "mono")}>
                  <span>Category</span>
                  <span>Screen / Stage</span>
                </div>
                <figure className={c("cat-shape", "arch")}>
                  <Image
                    {...designImage("saree")}
                    alt="Chaithrika in a traditional orange and green outfit, leaning on a tree and looking up"
                    sizes="(max-width: 720px) 78vw, (max-width: 1200px) 36vw, 440px"
                  />
                </figure>
                <div>
                  <h3>Acting</h3>
                  <div className={c("cat-foot", "mono")}>
                    <ul>
                      <li>Screen</li>
                      <li>Stage</li>
                      <li>Performance</li>
                    </ul>
                    <span className={styles.go}>
                      Cast her <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className={c("sec", "work")} id="work" aria-labelledby="work-title">
          <div className={styles.wrap}>
            <div className={styles["sec-top"]}>
              <p className={styles.mono}>Featured work</p>
              <h2 id="work-title" data-reveal>
                Runway and campaign
              </h2>
            </div>
            <article className={styles.project}>
              <figure className={styles["project-media"]} data-spin data-reveal>
                <Image
                  {...designImage("runway")}
                  alt="Chaithrika walking the IKFW Season 11 runway in a kalamkari crop top and mint striped lehenga under stage lights"
                  sizes="(max-width: 720px) 92vw, 42vw"
                />
                <span className={styles.sq} aria-hidden="true" />
              </figure>
              <div className={styles["project-body"]} data-reveal>
                <p className={c("mono", "tag")}>
                  <span className={styles.dot} aria-hidden="true" />
                  Runway show
                </p>
                <h3>India Kids Fashion Week S11</h3>
                <p>
                  A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable
                  runway finish.
                </p>
                <dl className={c("spec", "mono")}>
                  <div>
                    <dt>Event</dt>
                    <dd>IKFW Season 11</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>Runway</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>Dec 18, 2024</dd>
                  </div>
                </dl>
              </div>
            </article>
            <article className={styles.project}>
              <figure className={styles["project-media"]} data-reveal>
                <Image
                  {...designImage("green-gown")}
                  alt="Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind"
                  sizes="(max-width: 720px) 92vw, 42vw"
                />
              </figure>
              <div className={styles["project-body"]} data-reveal>
                <p className={c("mono", "tag")}>
                  <span className={styles.dot} aria-hidden="true" />
                  Brand photoshoot
                </p>
                <h3>Pinnacle Business Park</h3>
                <p>
                  A brand campaign shot at one of Bangalore’s premier business destinations, balancing couture,
                  confidence, and polished camera presence.
                </p>
                <dl className={c("spec", "mono")}>
                  <div>
                    <dt>Location</dt>
                    <dd>Bangalore</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>Campaign</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>2024</dd>
                  </div>
                </dl>
              </div>
            </article>
            <div className={styles.also}>
              <span className={styles.mono}>Also modelled for</span>
              <strong>Amazon Kids Dress</strong>
              <span className={styles.mono}>Commercial</span>
            </div>
          </div>
        </section>

        <section className={styles.sec} aria-labelledby="gallery-title">
          <div className={styles.wrap}>
            <div className={styles["sec-top"]}>
              <p className={styles.mono}>Gallery</p>
              <h2 id="gallery-title" data-reveal>
                Range, frame by frame
              </h2>
            </div>
            <div className={styles["g-grid"]}>
              <GalleryItem
                name="floral-lehenga"
                alt="Chaithrika twirling in a cream floral skirt with a maroon embellished top"
                num="01/08"
                caption="Movement"
              />
              <div className={styles["g-empty"]} aria-hidden="true" />
              <GalleryItem
                name="teal-lehenga"
                alt="Chaithrika in a green blouse and orange silk lehenga with a teal and yellow dupatta"
                num="02/08"
                caption="Heritage"
              />
              <GalleryItem
                name="fairy"
                alt="Chaithrika in a white tulle dress with fairy wings"
                num="03/08"
                caption="Character"
              />
              <div className={styles["g-note"]} data-reveal>
                <span className={styles.mono}>Index</span>
                <p>Studio, runway, outdoor and everyday. One performer, many moods.</p>
              </div>
              <GalleryItem
                name="backstage"
                alt="Chaithrika backstage at IKFW, looking into a bulb-lit makeup mirror"
                num="04/08"
                caption="Backstage"
              />
              <GalleryItem
                name="garden"
                alt="Chaithrika in a black and gold half-saree in a flowering garden, smiling shyly"
                num="05/08"
                caption="Outdoor"
              />
              <div className={styles["g-shape"]} data-spin aria-hidden="true">
                <span />
              </div>
              <GalleryItem
                name="navy-ethnic"
                alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"
                num="06/08"
                caption="Quiet"
              />
              <GalleryItem
                name="red-peplum"
                alt="Chaithrika smiling in a red brocade peplum and pink skirt"
                num="07/08"
                caption="Brocade"
              />
              <div className={styles["g-empty"]} aria-hidden="true" />
              <GalleryItem
                name="park"
                alt="Chaithrika in a yellow tee with an owl backpack on a red bench"
                num="08/08"
                caption="Lifestyle"
              />
            </div>
          </div>
        </section>

        <section className={styles.quote} aria-label="In her words">
          <span className={styles["quote-half"]} data-spin aria-hidden="true" />
          <div className={styles.wrap}>
            <blockquote data-reveal>
              <p>“Modeling and acting both ask for presence. I love the challenge each one brings.”</p>
              <footer className={styles.mono}>Chaithrika</footer>
            </blockquote>
          </div>
        </section>

        <section className={styles.sec} id="contact" aria-labelledby="book-title">
          <div className={styles.wrap}>
            <div className={styles["sec-top"]}>
              <p className={styles.mono}>Contact</p>
              <p className={c("mono", "tag", "sec-aside")}>
                <span className={styles.dot} aria-hidden="true" />
                Available for bookings
              </p>
            </div>
            <div className={styles["book-grid"]}>
              <div className={styles["book-head"]}>
                <h2 id="book-title" data-reveal>
                  Let’s create something beautiful together<span className={styles.o}>.</span>
                </h2>
                <p data-reveal>
                  Bookings are handled by Chaithrika’s parents. Tell them about your show, shoot or production and they
                  will reply personally.
                </p>
                <div className={c("note", "mono")} data-reveal>
                  <div>
                    Modeling
                    <br />
                    <b>Runway, editorial, campaigns</b>
                  </div>
                  <div>
                    Acting
                    <br />
                    <b>Screen, stage, performance</b>
                  </div>
                </div>
              </div>
              <form className={styles.form} id="enquiry" noValidate data-reveal onSubmit={onSubmit}>
                <div className={styles["form-row"]}>
                  <div className={styles.field}>
                    <label className={styles.mono} htmlFor="f-name">
                      Name
                    </label>
                    <input
                      id="f-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.mono} htmlFor="f-company">
                      Brand / company
                    </label>
                    <input
                      id="f-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Brand or production"
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.mono} htmlFor="f-type">
                    Project type
                  </label>
                  <select id="f-type" name="type" defaultValue="runway">
                    <option value="runway">Runway show</option>
                    <option value="editorial">Editorial shoot</option>
                    <option value="campaign">Brand campaign</option>
                    <option value="commercial">Commercial / e-commerce</option>
                    <option value="acting">Film, TV or stage</option>
                    <option value="event">Event appearance</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.mono} htmlFor="f-message">
                    Message
                  </label>
                  <textarea
                    id="f-message"
                    name="message"
                    rows={4}
                    placeholder="Dates, location and the brief in a few lines"
                  />
                </div>
                <div className={styles["form-foot"]}>
                  <span className={styles.mono}>Replies come from her parents</span>
                  <button className={styles.btn} type="submit">
                    Send enquiry <Arrow />
                  </button>
                </div>
                <p className={styles["form-msg"]} id="form-msg" role="status" hidden={!formMsg}>
                  {formMsg}
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles["site-footer"]}>
        <div className={styles.wrap}>
          <div className={styles["foot-cols"]}>
            <div>
              <p className={styles.mono}>Chaithrika</p>
              <p>Child model and actress from India. Runway, editorial, commercial and acting.</p>
            </div>
            <div>
              <p className={styles.mono}>Work</p>
              <ul>
                <li>
                  <a href="#modeling">Modeling</a>
                </li>
                <li>
                  <a href="#acting">Acting</a>
                </li>
                <li>
                  <a href="#work">Work</a>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.mono}>Info</p>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.mono}>Social</p>
              <ul>
                <li>
                  <a href="#">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles["foot-mark"]} aria-hidden="true">
            <span ref={fitLineRef}>Chaithrika</span>
          </div>
          <div className={c("foot-bottom", "mono")}>
            <span>© 2026 Charming Chaithrika</span>
            <span className={styles["foot-meta"]}>
              <span>Design option 07 of 10 — Modern Neo-Minimal</span>
              <Link href="/designs">
                View all designs <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GalleryItem({
  name,
  alt,
  num,
  caption,
}: {
  name: Parameters<typeof designImage>[0];
  alt: string;
  num: string;
  caption: string;
}) {
  return (
    <figure className={styles["g-item"]} data-reveal>
      <Image
        {...designImage(name)}
        alt={alt}
        sizes="(max-width: 720px) 46vw, (max-width: 960px) 31vw, (max-width: 1440px) 24vw, 340px"
      />
      <figcaption className={styles.mono}>
        <span>{num}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
