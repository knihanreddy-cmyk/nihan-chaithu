"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./design.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Class list for a scroll-reveal element, with an optional stagger delay (1-3). */
const reveal = (delay?: 1 | 2 | 3, ...extra: string[]) =>
  cx(styles.reveal, delay && styles[`d${delay}`], ...extra);

const NAV = [
  ["#modeling", "Modeling"],
  ["#acting", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
  ["#contact", "Contact"],
] as const;

const SHOTS = [
  {
    name: "white-chair",
    alt: "Chaithrika in a white tulle dress seated on a white folding chair",
    title: "Soft white.",
    text: "Tulle on a heart backdrop.",
  },
  {
    name: "teal-lehenga",
    alt: "Chaithrika in a green blouse, orange silk lehenga and teal dupatta, looking away",
    title: "Silk & colour.",
    text: "Traditional, full length.",
  },
  {
    name: "fairy",
    alt: "Chaithrika in a white tulle dress with fairy wings against a grey backdrop",
    title: "Wings.",
    text: "A studio fairy tale.",
  },
  {
    name: "garden",
    alt: "Chaithrika in a black and gold half-saree in a flowering garden, smiling shyly",
    title: "Garden light.",
    text: "Black and gold half-saree.",
    position: "50% 30%",
  },
  {
    name: "green-gown",
    alt: "Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind",
    title: "Emerald.",
    text: "Gown and tiara, outdoors.",
  },
  {
    name: "navy-ethnic",
    alt: "Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds",
    title: "Quiet moments.",
    text: "Navy and hibiscus.",
    position: "50% 30%",
  },
  {
    name: "park",
    alt: "Chaithrika in a yellow tee with an owl backpack on a red park bench",
    title: "Off duty.",
    text: "Playful lifestyle.",
  },
  {
    name: "yellow-jeep",
    alt: "Chaithrika in a yellow butterfly sweatshirt stepping out of a jeep",
    title: "Colour pop.",
    text: "Casual, on location.",
  },
] as const satisfies readonly {
  name: Parameters<typeof designImage>[0];
  alt: string;
  title: string;
  text: string;
  position?: string;
}[];

export default function Design3({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#FFFFFF");

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  // Reveals, hero scale and tile parallax (the template's html.js behaviour).
  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    const sticky = stickyRef.current;
    if (!root || !hero || !sticky) return;

    const html = document.documentElement;
    const prevPadding = html.style.scrollPaddingTop;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollPaddingTop = "calc(52px + 8px)";

    root.classList.add(styles.ready);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) html.style.scrollBehavior = "auto";

    // Reveals
    const items = root.querySelectorAll<HTMLElement>(`.${styles.reveal}`);
    let io: IntersectionObserver | undefined;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add(styles.in));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add(styles.in);
              observer.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      items.forEach((el) => observer.observe(el));
      io = observer;
    }

    // Hero scale + parallax
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const px = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
    function update() {
      raf = 0;
      if (!hero || !sticky) return;
      const r = hero.getBoundingClientRect();
      const travel = Math.max(1, hero.offsetHeight - sticky.offsetHeight);
      const p = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.15) / travel));
      hero.style.setProperty("--p", p.toFixed(4));
      const vh = window.innerHeight;
      px.forEach((img) => {
        const parent = img.parentElement;
        if (!parent) return;
        const b = parent.getBoundingClientRect();
        if (b.bottom < 0 || b.top > vh) return;
        const off = (b.top + b.height / 2 - vh / 2) / vh;
        img.style.transform = `translate3d(0,${(off * -4).toFixed(2)}%,0)`;
      });
    }

    if (reduce) {
      hero.style.setProperty("--p", "1");
    } else {
      hero.style.setProperty("--p", "0");
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove(styles.ready);
      html.style.scrollPaddingTop = prevPadding;
      html.style.scrollBehavior = prevBehavior;
    };
  }, []);

  // Mobile menu: Escape closes and returns focus; widening past the breakpoint closes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 820) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const scrollGallery = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(`.${styles.shot}`);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = card ? card.getBoundingClientRect().width + gap : 300;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: step * dir, behavior: reduce ? "auto" : "smooth" });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMsg("Thank you — this is a design preview, so nothing was sent.");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={rootRef} className={cx(styles.root, fontClassName)}>
      <header className={styles.nav} id="top">
        <div className={styles.wrap}>
          <a className={styles.brand} href="#top">
            Chaithrika
          </a>
          <ul className={styles.navLinks}>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <a className={styles.pill} href="#contact">
            Book
          </a>
          <button
            ref={menuBtnRef}
            className={styles.menuBtn}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
          </button>
        </div>
        <nav className={styles.mobilePanel} id="mobile-menu" aria-label="Mobile" hidden={!menuOpen}>
          <ul>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a className={styles.pill} href="#contact" onClick={closeMenu}>
            Book Chaithrika
          </a>
        </nav>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.wrap}>
            <p className={styles.mono}>Child model &amp; actress · India</p>
            <h1 id="hero-title">Chaithrika.</h1>
            <p className={styles.heroSub}>Model. Actress. Pure presence.</p>
            <p className={styles.heroLinks}>
              <a href="#contact">Book her ›</a>
              <a href="#work">See the work ›</a>
            </p>
          </div>
          <div className={styles.heroMedia} ref={heroRef}>
            <div className={styles.heroSticky} ref={stickyRef}>
              <figure className={styles.heroFrame}>
                <Image
                  {...designImage("blue-gown")}
                  alt="Chaithrika in a teal-blue rose ball gown, hand on hip, beside a wooden stool against a pink studio backdrop"
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  preload
                />
                <figcaption className={styles.heroCaption}>
                  <strong>Couture, at ease.</strong>
                  <span>Studio portrait in teal-blue rose tulle.</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className={styles.sec} id="about" aria-labelledby="about-title">
          <div className={styles.wrap}>
            <p className={reveal(undefined, styles.eyebrow)}>About</p>
            <h2 className={styles.visuallyHidden} id="about-title">
              About Chaithrika
            </h2>
            <p className={reveal(1, styles.statement)}>
              From <b>India Kids Fashion Week Season 11</b> to <b>Amazon Kids Dress</b>, Chaithrika
              brings confidence, creativity and expressive performance to every brief.
            </p>
            <p className={reveal(2, styles.lead)} style={{ marginTop: 28 }}>
              Her work blends clean camera presence with a natural sense of movement and story.
            </p>
            <div className={styles.disciplines}>
              <div className={reveal()}>
                <h3>Runway</h3>
                <p>A poised walk, graceful movement and a finish the audience remembers.</p>
              </div>
              <div className={reveal(1)}>
                <h3>Editorial</h3>
                <p>Studio couture and styled stories, held with easy confidence.</p>
              </div>
              <div className={reveal(2)}>
                <h3>Commercial</h3>
                <p>Brand campaigns and e-commerce, from Amazon Kids Dress onward.</p>
              </div>
              <div className={reveal(3)}>
                <h3>Acting</h3>
                <p>Expressive performance for screen, stage and story-led shoots.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={cx(styles.sec, styles.grey)} aria-labelledby="range-title">
          <div className={styles.wrap}>
            <div className={cx(styles.bentoHead, styles.center)}>
              <p className={reveal(undefined, styles.eyebrow)}>Range</p>
              <h2 className={reveal(1, styles.h2)} id="range-title">
                One face. Every kind of stage.
              </h2>
            </div>
            <div className={styles.bento}>
              <article className={reveal(undefined, styles.tile, styles.tileTall)}>
                <Image
                  {...designImage("runway")}
                  data-parallax=""
                  alt="Chaithrika on the IKFW runway in a kalamkari crop top and mint striped lehenga under stage lights"
                  sizes="(max-width: 767px) 100vw, 660px"
                  style={{ objectPosition: "50% 25%" }}
                />
                <div className={styles.tileCopy}>
                  <p className={styles.tLabel}>Runway</p>
                  <h3>Lit up by the lights, never lost in them.</h3>
                </div>
              </article>
              <article className={reveal(1, styles.tile)}>
                <Image
                  {...designImage("floral-lehenga")}
                  data-parallax=""
                  alt="Chaithrika twirling in a maroon embellished top and cream floral skirt on a pink backdrop"
                  sizes="(max-width: 767px) 100vw, 540px"
                  style={{ objectPosition: "50% 20%" }}
                />
                <div className={styles.tileCopy}>
                  <p className={styles.tLabel}>Editorial</p>
                  <h3>Movement, caught mid-turn.</h3>
                </div>
              </article>
              <article className={reveal(2, styles.tile)}>
                <Image
                  {...designImage("backstage")}
                  data-parallax=""
                  alt="Chaithrika backstage at IKFW, looking into a bulb-lit makeup mirror"
                  sizes="(max-width: 767px) 100vw, 540px"
                  style={{ objectPosition: "50% 35%" }}
                />
                <div className={styles.tileCopy}>
                  <p className={styles.tLabel}>Acting</p>
                  <h3>The story starts before the stage.</h3>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.sec} aria-label="Portfolio categories">
          <div className={styles.wrap}>
            <div className={styles.feature} id="modeling">
              <div className={reveal(undefined, styles.featureMedia)}>
                <Image
                  {...designImage("red-peplum")}
                  data-parallax=""
                  alt="Chaithrika smiling in a red brocade peplum top and pink skirt against a pink backdrop"
                  sizes="(max-width: 767px) 100vw, 560px"
                />
              </div>
              <div className={styles.featureCopy}>
                <p className={reveal(undefined, styles.eyebrow)}>Modeling</p>
                <h2 className={reveal(1, styles.h2)}>Made for the camera. At home on the ramp.</h2>
                <p className={reveal(2, styles.lead)}>
                  Runway shows, studio editorials and fashion campaigns, delivered with polish and a
                  smile that reads from the back row.
                </p>
                <ul className={reveal(3, styles.tags)}>
                  <li>Runway</li>
                  <li>Editorial</li>
                  <li>Fashion campaigns</li>
                </ul>
                <a className={reveal(3, styles.more)} href="#contact">
                  Enquire for modeling ›
                </a>
              </div>
            </div>
            <div className={cx(styles.feature, styles.featureFlip)} id="acting">
              <div className={reveal(undefined, styles.featureMedia)}>
                <Image
                  {...designImage("saree")}
                  data-parallax=""
                  alt="Chaithrika in an orange and green traditional outfit with jewellery, leaning on a tree and looking up"
                  sizes="(max-width: 767px) 100vw, 560px"
                  style={{ objectPosition: "50% 30%" }}
                />
              </div>
              <div className={styles.featureCopy}>
                <p className={reveal(undefined, styles.eyebrow)}>Acting</p>
                <h2 className={reveal(1, styles.h2)}>Every look tells a story.</h2>
                <p className={reveal(2, styles.lead)}>
                  Natural, expressive and easy to direct, for screen work, stage and
                  performance-led briefs.
                </p>
                <ul className={reveal(3, styles.tags)}>
                  <li>Screen</li>
                  <li>Stage</li>
                  <li>Performance</li>
                </ul>
                <a className={reveal(3, styles.more)} href="#contact">
                  Enquire for acting ›
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={cx(styles.sec, styles.grey)} id="work" aria-labelledby="work-title">
          <div className={styles.wrap}>
            <div className={styles.center}>
              <p className={reveal(undefined, styles.eyebrow)}>Featured work</p>
              <h2 className={reveal(1, styles.h2)} id="work-title">
                Recent highlights.
              </h2>
            </div>
            <div className={styles.workGrid}>
              <article className={reveal(undefined, styles.workCard)}>
                <div className={styles.workCopy}>
                  <p className={styles.mono}>Runway · Dec 18, 2024</p>
                  <h3>India Kids Fashion Week, Season 11.</h3>
                  <p>
                    A poised walk at IKFW Season 11 with expressive stage presence, graceful
                    movement and a memorable runway finish.
                  </p>
                </div>
                <div className={styles.workStage}>
                  <Image
                    {...designImage("runway-cutout")}
                    alt="Chaithrika's IKFW runway look: kalamkari crop top with a mint striped lehenga"
                    sizes="(max-width: 767px) 240px, 370px"
                  />
                </div>
              </article>
              <article className={reveal(undefined, styles.workCard, styles.workCardFlip)}>
                <div className={styles.workCopy}>
                  <p className={styles.mono}>Brand photoshoot · 2024</p>
                  <h3>Pinnacle Business Park.</h3>
                  <p>
                    A brand campaign shot at one of Bangalore&apos;s premier business destinations,
                    balancing couture, confidence and polished camera presence.
                  </p>
                </div>
                <div className={styles.workPhoto}>
                  <Image
                    {...designImage("orange-flowers")}
                    alt="Chaithrika in an orange dress with 3D flowers, hands on hips, against a grey backdrop"
                    sizes="(max-width: 767px) 100vw, 580px"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.sec} aria-labelledby="gal-title">
          <div className={styles.wrap}>
            <div className={styles.galHead}>
              <div>
                <p className={reveal(undefined, styles.eyebrow)}>Gallery</p>
                <h2 className={reveal(1, styles.h2)} id="gal-title">
                  Take a closer look.
                </h2>
              </div>
              <div className={reveal(2, styles.galControls)}>
                <button
                  className={styles.galBtn}
                  type="button"
                  aria-label="Previous photos"
                  onClick={() => scrollGallery(-1)}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M10.5 2.5 5 8l5.5 5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className={styles.galBtn}
                  type="button"
                  aria-label="Next photos"
                  onClick={() => scrollGallery(1)}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M5.5 2.5 11 8l-5.5 5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className={reveal(1, styles.track)}
              ref={trackRef}
              tabIndex={0}
              role="region"
              aria-label="Photo gallery, scroll horizontally"
            >
              {SHOTS.map((s) => (
                <figure className={styles.shot} key={s.name}>
                  <div className={styles.shotImg}>
                    <Image
                      {...designImage(s.name)}
                      alt={s.alt}
                      sizes="(max-width: 800px) 240px, (max-width: 1266px) 30vw, 380px"
                      style={"position" in s ? { objectPosition: s.position } : undefined}
                    />
                  </div>
                  <figcaption>
                    <b>{s.title}</b> {s.text}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={cx(styles.sec, styles.grey)} aria-labelledby="specs-title">
          <div className={cx(styles.wrap, styles.specsGrid)}>
            <div>
              <p className={reveal(undefined, styles.eyebrow)}>At a glance</p>
              <h2 className={reveal(1, styles.h2)} id="specs-title">
                Specs.
              </h2>
            </div>
            <div className={reveal(1, styles.specs)}>
              <dl>
                <div className={styles.spec}>
                  <dt>Disciplines</dt>
                  <dd>Runway · Editorial · Commercial · Acting</dd>
                </div>
                <div className={styles.spec}>
                  <dt>Recent runway</dt>
                  <dd>
                    India Kids Fashion Week, Season 11<small>Dec 18, 2024</small>
                  </dd>
                </div>
                <div className={styles.spec}>
                  <dt>Campaign</dt>
                  <dd>
                    Pinnacle Business Park — Brand Photoshoot<small>Bangalore, 2024</small>
                  </dd>
                </div>
                <div className={styles.spec}>
                  <dt>Brand</dt>
                  <dd>Amazon Kids Dress</dd>
                </div>
                <div className={styles.spec}>
                  <dt>Based in</dt>
                  <dd>India</dd>
                </div>
                <div className={styles.spec}>
                  <dt>Bookings</dt>
                  <dd>Managed by her parents</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className={cx(styles.sec, styles.quote)} aria-label="In her words">
          <div className={styles.wrap}>
            <figure>
              <blockquote className={reveal()}>
                <p>
                  “Modeling and acting both ask for presence.{" "}
                  <span className={styles.soft}>I love the challenge each one brings.”</span>
                </p>
              </blockquote>
              <figcaption className={reveal(1)}>
                <cite className={styles.mono}>Chaithrika</cite>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={cx(styles.sec, styles.grey)} id="contact" aria-labelledby="contact-title">
          <div className={cx(styles.wrap, styles.book)}>
            <div>
              <p className={reveal(undefined, styles.eyebrow)}>Bookings</p>
              <h2 className={reveal(1, styles.h2)} id="contact-title">
                Let&apos;s create something beautiful together.
              </h2>
              <p className={reveal(2, styles.avail)}>Available for bookings</p>
              <p className={reveal(2, styles.bookNote)}>
                Runway, campaigns, editorials and acting roles. Bookings are managed by her parents.
              </p>
            </div>
            <form id="enquiry" className={reveal(1, styles.form)} noValidate onSubmit={onSubmit}>
              <div className={styles.field}>
                <label htmlFor="f-name">Your name</label>
                <input id="f-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="f-company">Brand or company</label>
                <input id="f-company" name="company" type="text" autoComplete="organization" />
              </div>
              <div className={cx(styles.field, styles.fieldFull)}>
                <label htmlFor="f-type">Project type</label>
                <select id="f-type" name="type">
                  <option>Runway show</option>
                  <option>Editorial shoot</option>
                  <option>Brand campaign</option>
                  <option>E-commerce</option>
                  <option>Acting — screen</option>
                  <option>Acting — stage</option>
                  <option>Event appearance</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className={cx(styles.field, styles.fieldFull)}>
                <label htmlFor="f-msg">Tell us about the project</label>
                <textarea id="f-msg" name="message" placeholder="Dates, location, brief…"></textarea>
              </div>
              <div className={styles.submitRow}>
                <button className={styles.pill} type="submit">
                  Send enquiry
                </button>
                <p className={styles.formMsg} id="form-msg" role="status" aria-live="polite">
                  {formMsg}
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.footTop}>
            <ul className={styles.footLinks}>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
            <span>Charming Chaithrika · Child model &amp; actress, India</span>
          </div>
          <div className={styles.footBottom}>
            <span>© 2026 Chaithrika. All rights reserved.</span>
            <span className={styles.footDesign}>
              <span>Design option 03 of 10 — Apple-Inspired Minimal</span>
              <Link className={styles.footAll} href="/designs">
                View all designs
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
