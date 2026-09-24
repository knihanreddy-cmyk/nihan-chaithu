"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { designImage, usePageBackground, type DesignImageName } from "@/components/designs/shared";
import styles from "./design.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: string[]) => names.map((n) => styles[n]).join(" ");

const NAV = [
  { href: "#modeling", label: "Modeling" },
  { href: "#acting", label: "Acting" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const SHOTS: { name: DesignImageName; ratio: string; alt: string; title: string; kind: string }[] = [
  {
    name: "floral-lehenga",
    ratio: "2/3",
    alt: "Chaithrika twirling in a cream floral skirt and maroon embellished top",
    title: "In motion",
    kind: "Studio",
  },
  {
    name: "teal-lehenga",
    ratio: "3/4",
    alt: "Chaithrika in a green blouse and orange silk lehenga with a teal and yellow dupatta, looking off to the side",
    title: "Heritage silk",
    kind: "Studio",
  },
  {
    name: "white-chair",
    ratio: "4/5",
    alt: "Chaithrika in a white tulle dress seated on a white folding chair",
    title: "Soft white",
    kind: "Editorial",
  },
  {
    name: "red-peplum",
    ratio: "3/4",
    alt: "Chaithrika smiling in a red brocade peplum and pink skirt",
    title: "Brocade",
    kind: "Studio",
  },
  {
    name: "fairy",
    ratio: "2/3",
    alt: "Chaithrika in a white tulle dress with fairy wings",
    title: "The fairy",
    kind: "Character",
  },
  {
    name: "park",
    ratio: "4/5",
    alt: "Chaithrika in a yellow tee with an owl backpack on a red bench",
    title: "Playtime",
    kind: "Lifestyle",
  },
  {
    name: "orange-flowers",
    ratio: "2/3",
    alt: "Chaithrika in an orange dress with 3D flowers, hands on hips",
    title: "In bloom",
    kind: "Studio",
  },
  {
    name: "yellow-jeep",
    ratio: "3/4",
    alt: "Chaithrika in a yellow butterfly sweatshirt stepping out of a jeep",
    title: "Colour pop",
    kind: "Commercial",
  },
];

const THANKS = "Thank you — this is a design preview, so nothing was sent.";

/** Moves the card's gold glow to follow the pointer. */
function trackGlow(e: ReactPointerEvent<HTMLElement>) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Card({ className, delay, children }: { className?: string; delay?: string; children: ReactNode }) {
  return (
    <article
      className={className ? `${styles.card} ${className}` : styles.card}
      data-reveal
      data-delay={delay}
      onPointerMove={trackGlow}
    >
      {children}
    </article>
  );
}

export default function Design2({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#0B0A09");

  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  /* Header gains its hairline once the page scrolls. */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => header.classList.toggle(styles.scrolled, window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  /* Scroll reveals, gated so server-rendered content stays visible without JS. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    root.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove(styles.ready);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMsg(THANKS);
    e.currentTarget.reset();
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${fontClassName}`}>
      <header ref={headerRef} className={styles["site-header"]} id="top">
        <div className={c("wrap", "nav")}>
          <a className={styles.wordmark} href="#top" aria-label="Chaithrika, home">
            Chaithrika <small>Charming</small>
          </a>
          <nav aria-label="Primary">
            <ul className={styles["nav-links"]}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className={styles.btn} href="#contact">
            Book
          </a>
          <button
            ref={toggleRef}
            className={styles["menu-toggle"]}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
        <div className={styles["mobile-panel"]} id="mobile-panel" hidden={!menuOpen}>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className={c("btn", "solid")} href="#contact" onClick={closeMenu}>
            Book Chaithrika
          </a>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-label="Introduction">
          <div className={styles["hero-frame"]}>
            <Image {...designImage("runway")} alt="" aria-hidden="true" sizes="108vw" className={styles["hero-bg"]} preload />
            <div className={styles["hero-glow"]} aria-hidden="true" />
            <Image
              {...designImage("runway-cutout")}
              alt="Chaithrika on the IKFW runway in a kalamkari crop top and mint striped lehenga"
              sizes="(max-width: 860px) 32px, 560px"
              loading="eager"
              className={styles["hero-cutout"]}
            />
            <div className={styles.grain} aria-hidden="true" />
            <div className={styles["hero-copy"]}>
              <span className={styles.label}>
                <span className={styles.rule} aria-hidden="true" />
                Child model &amp; actress · India
              </span>
              <h1>
                <span>Presenting</span>Chaithrika
              </h1>
              <p className={styles["hero-lede"]}>
                Runway poise, editorial stillness and a performer’s instinct for story.
              </p>
              <div className={styles["hero-ctas"]}>
                <a className={c("btn", "solid")} href="#contact">
                  Enquire for bookings
                </a>
                <a className={c("btn", "ghost")} href="#work">
                  View selected work
                </a>
              </div>
            </div>
          </div>
          <div className={styles["hero-bar"]}>
            <span className={styles.credit}>
              India Kids Fashion Week · <b>Season 11</b> · Dec 18, 2024
            </span>
            <span>Runway · Editorial · Commercial · Acting</span>
          </div>
        </section>

        <section className={c("section", "about")} id="about" aria-labelledby="about-title">
          <div className={c("wrap", "about-grid")}>
            <figure className={styles.framed} data-reveal>
              <Image
                {...designImage("navy-ethnic")}
                alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"
                sizes="(max-width: 900px) min(520px, 90vw), 470px"
              />
              <figcaption>A quiet moment, between frames</figcaption>
            </figure>
            <div>
              <p className={styles.label} data-reveal>
                About Chaithrika
              </p>
              <h2 id="about-title" data-reveal>
                Clean camera presence, <em>a natural sense of story.</em>
              </h2>
              <p className={styles.bio} data-reveal>
                From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence, creativity,
                and expressive performance to every brief. Her work blends clean camera presence with a natural sense
                of movement and story.
              </p>
              <ul className={styles.disciplines} aria-label="Disciplines" data-reveal>
                <li>
                  <strong>Runway</strong>
                  <span>Poise, pace and a finish the audience remembers.</span>
                </li>
                <li>
                  <strong>Editorial</strong>
                  <span>Stillness that holds the frame, couture that reads on camera.</span>
                </li>
                <li>
                  <strong>Commercial</strong>
                  <span>Warm, natural and on brief for kids’ fashion brands.</span>
                </li>
                <li>
                  <strong>Acting</strong>
                  <span>Expressive performance for screen and stage.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={c("section", "cats")} aria-labelledby="cats-title">
          <div className={styles.wrap}>
            <div className={styles["section-head"]}>
              <div>
                <p className={styles.label} data-reveal>
                  Two disciplines
                </p>
                <h2 id="cats-title" data-reveal>
                  One presence, <em>two stages.</em>
                </h2>
              </div>
              <p data-reveal>
                Whether the brief calls for a runway walk under stage lights or a character on screen, the same calm
                confidence carries through.
              </p>
            </div>
            <div className={styles["cat-grid"]}>
              <a className={styles.cat} id="modeling" href="#work" data-reveal>
                <Image
                  {...designImage("blue-gown")}
                  alt="Chaithrika in a teal-blue rose ball gown, hand on hip, beside a wooden stool"
                  sizes="(max-width: 760px) 100vw, (max-width: 1280px) 48vw, 610px"
                />
                <div className={styles["cat-body"]}>
                  <h3>Modeling</h3>
                  <p>Runway · Editorial · Fashion campaigns</p>
                  <span className={styles.more}>
                    See the work <i aria-hidden="true" />
                  </span>
                </div>
              </a>
              <a className={styles.cat} id="acting" href="#contact" data-reveal data-delay="1">
                <Image
                  {...designImage("saree")}
                  alt="Chaithrika in a traditional orange and green outfit with jewellery, leaning on a tree and looking up"
                  sizes="(max-width: 760px) 100vw, (max-width: 1280px) 48vw, 610px"
                />
                <div className={styles["cat-body"]}>
                  <h3>Acting</h3>
                  <p>Screen · Stage · Performance</p>
                  <span className={styles.more}>
                    Cast Chaithrika <i aria-hidden="true" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.section} id="work" aria-labelledby="work-title">
          <div className={styles.wrap}>
            <div className={styles["section-head"]}>
              <div>
                <p className={styles.label} data-reveal>
                  Selected work
                </p>
                <h2 id="work-title" data-reveal>
                  Moments <em>under the lights.</em>
                </h2>
              </div>
              <p data-reveal>
                A runway debut at one of India’s most watched kids’ fashion weeks, and a brand campaign in the heart of
                Bangalore.
              </p>
            </div>
            <div className={styles["work-grid"]}>
              <Card>
                <div className={styles["card-media"]}>
                  <Image
                    {...designImage("backstage")}
                    alt="Chaithrika backstage at IKFW, looking into a bulb-lit makeup mirror, wearing an IKFW lanyard"
                    sizes="(max-width: 760px) 92vw, (max-width: 1280px) 46vw, 580px"
                  />
                  <span className={styles.tag}>Runway show</span>
                </div>
                <div className={styles["card-body"]}>
                  <p className={c("label", "muted")}>Dec 18, 2024</p>
                  <h3>
                    India Kids Fashion Week, <em>Season 11</em>
                  </h3>
                  <p>
                    A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable
                    runway finish.
                  </p>
                  <dl className={styles.facts}>
                    <div>
                      <dt>Format</dt>
                      <dd>Runway</dd>
                    </div>
                    <div>
                      <dt>Event</dt>
                      <dd>IKFW S11</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>18.12.2024</dd>
                    </div>
                  </dl>
                </div>
              </Card>
              <Card delay="1">
                <div className={styles["card-media"]}>
                  <Image
                    {...designImage("green-gown")}
                    alt="Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind"
                    sizes="(max-width: 760px) 92vw, (max-width: 1280px) 46vw, 580px"
                    style={{ objectPosition: "50% 25%" }}
                  />
                  <span className={styles.tag}>Brand photoshoot</span>
                </div>
                <div className={styles["card-body"]}>
                  <p className={c("label", "muted")}>2024 · Bangalore</p>
                  <h3>
                    Pinnacle Business Park, <em>brand campaign</em>
                  </h3>
                  <p>
                    A brand campaign shot at one of Bangalore’s premier business destinations, balancing couture,
                    confidence, and polished camera presence.
                  </p>
                  <dl className={styles.facts}>
                    <div>
                      <dt>Format</dt>
                      <dd>Campaign</dd>
                    </div>
                    <div>
                      <dt>City</dt>
                      <dd>Bangalore</dd>
                    </div>
                    <div>
                      <dt>Year</dt>
                      <dd>2024</dd>
                    </div>
                  </dl>
                </div>
              </Card>
            </div>
            <div className={c("card", "also")} data-reveal onPointerMove={trackGlow}>
              <div>
                <p className={c("label", "muted")}>Also featured</p>
                <h3>Amazon Kids Dress</h3>
              </div>
              <p>Commercial modelling for kids’ fashion</p>
            </div>
          </div>
        </section>

        <section className={c("section", "gallery")} aria-labelledby="gallery-title">
          <div className={styles.wrap}>
            <div className={styles["section-head"]}>
              <div>
                <p className={styles.label} data-reveal>
                  Gallery
                </p>
                <h2 id="gallery-title" data-reveal>
                  A range of <em>looks and moods.</em>
                </h2>
              </div>
              <p data-reveal>Couture, heritage and everyday play.</p>
            </div>
            <div className={styles.masonry}>
              {SHOTS.map((shot) => (
                <figure
                  key={shot.name}
                  className={styles.shot}
                  data-reveal
                  style={{ "--r": shot.ratio } as CSSProperties}
                >
                  <Image
                    {...designImage(shot.name)}
                    alt={shot.alt}
                    sizes="(max-width: 900px) 48vw, (max-width: 1280px) 31vw, 400px"
                  />
                  <figcaption>
                    <b>{shot.title}</b>
                    <span>{shot.kind}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.quote} aria-label="In her words">
          <Image {...designImage("garden")} alt="" aria-hidden="true" sizes="100vw" />
          <div className={styles.wrap}>
            <blockquote data-reveal>
              <span className={styles.mark} aria-hidden="true">
                &ldquo;
              </span>
              <p>Modeling and acting both ask for presence. I love the challenge each one brings.</p>
              <footer>
                <span className={styles.label}>
                  <span className={styles.rule} aria-hidden="true" />
                  Chaithrika
                </span>
              </footer>
            </blockquote>
          </div>
        </section>

        <section className={c("section", "book")} id="contact" aria-labelledby="book-title">
          <div className={c("wrap", "book-grid")}>
            <div>
              <p className={styles.label} data-reveal>
                Available for bookings
              </p>
              <h2 id="book-title" data-reveal>
                Let’s create something <em>beautiful</em> together.
              </h2>
              <p className={styles["book-intro"]} data-reveal>
                Bookings are handled personally by Chaithrika’s parents. Share a few details about your runway show,
                shoot or production and they will be in touch.
              </p>
              <ul className={styles["book-notes"]} data-reveal>
                <li>
                  <b>Modeling</b>Runway, editorial and fashion campaigns
                </li>
                <li>
                  <b>Acting</b>Screen, stage and performance
                </li>
                <li>
                  <b>Based</b>India, with work in Bangalore
                </li>
              </ul>
            </div>
            <form className={styles.form} id="enquiry" noValidate data-reveal data-delay="1" onSubmit={onSubmit}>
              <div className={styles["form-row"]}>
                <div className={styles.field}>
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Full name" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-company">Brand / company</label>
                  <input
                    id="f-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Brand, agency or production"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="f-type">Project type</label>
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
                <label htmlFor="f-message">Message</label>
                <textarea
                  id="f-message"
                  name="message"
                  rows={4}
                  placeholder="Dates, location and a line about the brief"
                />
              </div>
              <div className={styles["form-foot"]}>
                <small>Replies come from her parents.</small>
                <button className={c("btn", "solid")} type="submit">
                  Send enquiry
                </button>
              </div>
              <p className={styles["form-msg"]} id="form-msg" role="status" hidden={!formMsg}>
                {formMsg}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className={styles["site-footer"]}>
        <div className={styles.wrap}>
          <div className={styles["foot-top"]}>
            <div>
              <p className={styles["foot-mark"]}>Chaithrika</p>
              <p>Child model &amp; actress from India. Runway, editorial, commercial and acting.</p>
            </div>
            <div className={styles["foot-col"]}>
              <h4>Explore</h4>
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
                <li>
                  <a href="#about">About</a>
                </li>
              </ul>
            </div>
            <div className={styles["foot-col"]}>
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href="#contact">Book Chaithrika</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles["foot-bottom"]}>
            <span>© 2026 Charming Chaithrika</span>
            <span className={styles["foot-meta"]}>
              <span>Design option 02 of 10 — Dark Luxury</span>
              <Link href="/designs">View all designs</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
