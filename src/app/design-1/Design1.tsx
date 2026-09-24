"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./design.module.css";

/** Join CSS-module class names. */
const cx = (...names: string[]) => names.map((n) => styles[n]).join(" ");

const MENU = [
  { href: "#categories", label: "Modeling" },
  { href: "#categories", label: "Acting" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Design1({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#FAF8F4");

  const rootRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  // Menu: Escape closes and returns focus; widening past the breakpoint closes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
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

  // Scroll reveal (the template's html.js + IntersectionObserver).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    root.classList.add(styles.ready);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add(styles.in);
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    root.querySelectorAll(`.${CSS.escape(styles.rv)}`).forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove(styles.ready);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${fontClassName}`}>
      <header className={styles.nav} id="top">
        <div className={styles.wrap}>
          <a href="#top" className={styles.mark} aria-label="Chaithrika, home">
            Chaithrika <em>C.</em>
          </a>
          <nav aria-label="Primary">
            <ul className={styles["nav-links"]}>
              {MENU.map((m) => (
                <li key={m.label}>
                  <a className={styles.ul} href={m.href}>
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#contact" className={styles.book}>
            Book
          </a>
          <button
            ref={menuBtnRef}
            className={styles["menu-btn"]}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menuPanel"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Menu<span aria-hidden="true"></span>
          </button>
        </div>
        <div className={styles.panel} id="menuPanel" hidden={!menuOpen}>
          <ul>
            {MENU.map((m) => (
              <li key={m.label}>
                <a href={m.href} onClick={closeMenu}>
                  {m.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={closeMenu}>
                <em>Book Chaithrika</em>
              </a>
            </li>
          </ul>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="heroTitle">
          <div className={styles.wrap}>
            <div className={styles["hero-grid"]}>
              <div className={styles["hero-text"]}>
                <p className={cx("hero-kicker", "label")}>Child model &amp; actress &middot; India</p>
                <h1 id="heroTitle">
                  <span className={styles.it}>Charming</span>Chaithrika
                </h1>
                <p className={styles["hero-lede"]}>
                  Runway, editorial, commercial and screen. A young talent with clean camera presence and a
                  natural sense of movement and story.
                </p>
                <div className={styles["hero-cta"]}>
                  <a href="#contact" className={styles.book}>
                    Enquire for bookings
                  </a>
                  <a href="#gallery" className={cx("label", "ul")}>
                    View the lookbook
                  </a>
                </div>
              </div>
              <figure className={styles["hero-photo"]}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("white-chair")}
                    alt="Chaithrika in a white tulle dress, seated on a white folding chair against a pale backdrop with soft pink hearts"
                    sizes="(max-width: 420px) 100vw, (max-width: 720px) 90vw, (max-width: 960px) 66vw, (max-width: 1440px) 32vw, 460px"
                    preload
                  />
                </div>
              </figure>
              <p className={cx("hero-cap", "label")}>Look 01 &mdash; White tulle, studio</p>
            </div>
            <div className={styles["hero-meta"]}>
              <div>
                <span className={styles.label}>Runway</span>
                <p>India Kids Fashion Week, Season 11</p>
              </div>
              <div>
                <span className={styles.label}>Campaign</span>
                <p>Amazon Kids Dress</p>
              </div>
              <div>
                <span className={styles.label}>Brand shoot</span>
                <p>Pinnacle Business Park, 2024</p>
              </div>
              <div>
                <span className={styles.label}>Status</span>
                <p>
                  <em>Available for bookings</em>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sec} id="about" aria-labelledby="aboutTitle">
          <div className={styles.wrap}>
            <div className={styles["sec-head"]}>
              <p className={styles.label}>About</p>
              <h2 id="aboutTitle" className={styles.rv}>
                Presence, <em>quietly</em> held.
              </h2>
            </div>
            <div className={styles["about-grid"]}>
              <figure className={cx("about-img", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("garden")}
                    alt="Chaithrika in a black and gold half-saree in a flowering garden, smiling softly"
                    sizes="(max-width: 720px) 420px, (max-width: 960px) 40vw, (max-width: 1440px) 32vw, 460px"
                  />
                </div>
                <figcaption className={styles.label}>In the garden &mdash; black &amp; gold half-saree</figcaption>
              </figure>
              <div className={cx("about-copy", "rv")}>
                <p className={styles.big}>
                  From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings{" "}
                  <em>confidence, creativity,</em> and expressive performance to every brief.
                </p>
                <p className={cx("small", "after-big")}>
                  Her work blends clean camera presence with a natural sense of movement and story &mdash;
                  equally at ease holding a still frame in the studio as she is finishing a walk under stage
                  lights.
                </p>
                <ul className={styles.disc} aria-label="Disciplines">
                  <li>
                    <span className={styles.n}>Runway</span>
                    <span className={styles.d}>Fashion weeks &amp; stage shows</span>
                  </li>
                  <li>
                    <span className={styles.n}>Editorial</span>
                    <span className={styles.d}>Studio &amp; location stories</span>
                  </li>
                  <li>
                    <span className={styles.n}>Commercial</span>
                    <span className={styles.d}>Brand campaigns &amp; catalogue</span>
                  </li>
                  <li>
                    <span className={styles.n}>Acting</span>
                    <span className={styles.d}>Screen, stage &amp; performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={cx("sec", "cats")} id="categories" aria-labelledby="catTitle">
          <div className={styles.wrap}>
            <div className={styles["sec-head"]}>
              <p className={styles.label}>Portfolio</p>
              <h2 id="catTitle" className={styles.rv}>
                Two disciplines, <em>one presence.</em>
              </h2>
            </div>
            <div className={styles["cat-grid"]}>
              <a
                className={cx("cat", "rv")}
                href="#gallery"
                aria-label="Modeling portfolio: runway, editorial and fashion campaigns"
              >
                <div className={styles.frame}>
                  <Image
                    {...designImage("blue-gown")}
                    alt="Chaithrika in a teal-blue rose ball gown with a hand on her hip, beside a wooden stool against a pink backdrop"
                    sizes="(max-width: 720px) 100vw, (max-width: 1440px) 50vw, 700px"
                  />
                </div>
                <div className={styles["cat-meta"]}>
                  <h3>
                    Model<em>ing</em>
                  </h3>
                  <span className={styles.label}>Portfolio I</span>
                </div>
                <p>Runway &middot; Editorial &middot; Fashion campaigns</p>
              </a>
              <a
                className={cx("cat", "rv")}
                href="#gallery"
                aria-label="Acting portfolio: screen, stage and performance"
              >
                <div className={styles.frame}>
                  <Image
                    {...designImage("saree")}
                    alt="Chaithrika in an orange and green traditional outfit with jewellery, leaning on a tree and looking upward"
                    sizes="(max-width: 720px) 100vw, (max-width: 1440px) 50vw, 600px"
                  />
                </div>
                <div className={styles["cat-meta"]}>
                  <h3>
                    Act<em>ing</em>
                  </h3>
                  <span className={styles.label}>Portfolio II</span>
                </div>
                <p>Screen &middot; Stage &middot; Performance</p>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.sec} id="work" aria-labelledby="workTitle">
          <div className={styles.wrap}>
            <div className={styles["sec-head"]}>
              <p className={styles.label}>Selected work</p>
              <h2 id="workTitle" className={styles.rv}>
                On the runway, <em>and in the frame.</em>
              </h2>
            </div>

            <article className={cx("work-item", "rv")}>
              <div className={styles["work-img"]}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("runway")}
                    alt="Chaithrika walking the India Kids Fashion Week runway in a kalamkari crop top and mint striped lehenga under stage lights"
                    sizes="(max-width: 960px) 100vw, (max-width: 1440px) 58vw, 800px"
                  />
                </div>
              </div>
              <div className={styles["work-body"]}>
                <div className={styles.when}>
                  <span className={styles.label}>Runway show</span>
                  <span className={styles.label}>Dec 18, 2024</span>
                </div>
                <h3>
                  India Kids Fashion Week, <em>Season 11</em>
                </h3>
                <p>
                  A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a
                  memorable runway finish.
                </p>
              </div>
            </article>

            <article className={cx("work-item", "flip", "last", "rv")}>
              <div className={styles["work-img"]}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("red-peplum")}
                    alt="Chaithrika smiling in a red brocade peplum top and pink skirt against a pink studio backdrop"
                    sizes="(max-width: 960px) 100vw, (max-width: 1440px) 58vw, 800px"
                    className={styles.pos22}
                  />
                </div>
              </div>
              <div className={styles["work-body"]}>
                <div className={styles.when}>
                  <span className={styles.label}>Brand photoshoot</span>
                  <span className={styles.label}>2024</span>
                </div>
                <h3>
                  Pinnacle Business Park, <em>Bangalore</em>
                </h3>
                <p>
                  A brand campaign shot at one of Bangalore&apos;s premier business destinations, balancing
                  couture, confidence, and polished camera presence.
                </p>
              </div>
            </article>

            <div className={cx("also", "rv")}>
              <p>
                Also modelled for <em>Amazon Kids Dress.</em>
              </p>
              <a href="#contact" className={cx("label", "ul", "ink")}>
                Discuss a project
              </a>
            </div>
          </div>
        </section>

        <section className={cx("sec", "gallery")} id="gallery" aria-labelledby="galTitle">
          <div className={styles.wrap}>
            <div className={styles["sec-head"]}>
              <p className={styles.label}>Lookbook</p>
              <h2 id="galTitle" className={styles.rv}>
                Eight looks, <em>one season.</em>
              </h2>
            </div>
            <div className={styles.look}>
              <figure className={cx("g1", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("floral-lehenga")}
                    alt="Chaithrika twirling in a maroon embellished top and cream floral skirt on a pink backdrop"
                    sizes="(max-width: 720px) 100vw, (max-width: 1440px) 41vw, 560px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>The twirl</span>
                  <span className={styles.label}>Floral lehenga</span>
                </figcaption>
              </figure>
              <figure className={cx("g2", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("fairy")}
                    alt="Chaithrika in a white tulle dress with fairy wings against a grey backdrop"
                    sizes="(max-width: 720px) 50vw, (max-width: 1440px) 25vw, 330px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>Wings</span>
                  <span className={styles.label}>White tulle</span>
                </figcaption>
              </figure>
              <figure className={cx("g3", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("navy-ethnic")}
                    alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"
                    sizes="(max-width: 720px) 50vw, (max-width: 1440px) 25vw, 330px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>Hibiscus</span>
                  <span className={styles.label}>Navy embroidery</span>
                </figcaption>
              </figure>
              <figure className={cx("g4", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("teal-lehenga")}
                    alt="Chaithrika in a green blouse, orange silk lehenga and teal dupatta, looking off frame against grey"
                    sizes="(max-width: 720px) 50vw, (max-width: 1440px) 25vw, 330px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>Silk &amp; teal</span>
                  <span className={styles.label}>Festive</span>
                </figcaption>
              </figure>
              <figure className={cx("g5", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("orange-flowers")}
                    alt="Chaithrika in an orange dress with sculpted flowers, hands on hips, against a grey backdrop"
                    sizes="(max-width: 720px) 50vw, (max-width: 1440px) 33vw, 440px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>In bloom</span>
                  <span className={styles.label}>Orange flowers</span>
                </figcaption>
              </figure>
              <figure className={cx("g6", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("green-gown")}
                    alt="Chaithrika in a dark green gown and tiara, holding the skirt out wide in front of palm leaves"
                    sizes="(max-width: 720px) 50vw, (max-width: 1440px) 16vw, 220px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>Emerald</span>
                  <span className={styles.label}>Outdoor</span>
                </figcaption>
              </figure>
              <figure className={cx("g7", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("park")}
                    alt="Chaithrika in a yellow tee with an owl backpack on a red park bench"
                    sizes="(max-width: 720px) 50vw, (max-width: 1440px) 33vw, 440px"
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>Weekend</span>
                  <span className={styles.label}>Lifestyle</span>
                </figcaption>
              </figure>
              <figure className={cx("g8", "rv")}>
                <div className={styles.frame}>
                  <Image
                    {...designImage("backstage")}
                    alt="Chaithrika backstage at India Kids Fashion Week, looking into a bulb-lit mirror with her IKFW lanyard"
                    sizes="(max-width: 720px) 100vw, (max-width: 1440px) 58vw, 780px"
                    className={styles.pos40}
                  />
                </div>
                <figcaption>
                  <span className={styles.t}>Before the lights</span>
                  <span className={styles.label}>IKFW backstage</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className={styles.quote} aria-label="In her words">
          <div className={styles.wrap}>
            <div className={styles["quote-grid"]}>
              <blockquote className={styles.rv}>
                <p>
                  &ldquo;Modeling and acting both ask for <em>presence.</em> I love the challenge each one
                  brings.&rdquo;
                </p>
                <cite className={styles.label}>Chaithrika</cite>
              </blockquote>
            </div>
          </div>
        </section>

        <section className={styles.sec} id="contact" aria-labelledby="contactTitle">
          <div className={styles.wrap}>
            <div className={styles["contact-grid"]}>
              <div className={styles["contact-intro"]}>
                <p className={cx("label", "eyebrow")}>Bookings</p>
                <h2 id="contactTitle">
                  Let&apos;s create something <em>beautiful together.</em>
                </h2>
                <p>
                  Casting, campaigns, runway and events. Bookings are handled personally by her parents &mdash;
                  share a few details and they will be in touch.
                </p>
                <p className={cx("avail", "label")}>Available for bookings</p>
              </div>
              <form className={styles.form} id="enquiry" noValidate onSubmit={onSubmit}>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label htmlFor="f-name">Your name</label>
                    <input id="f-name" name="name" type="text" autoComplete="name" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="f-company">Brand / company</label>
                    <input id="f-company" name="company" type="text" autoComplete="organization" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-type">Project type</label>
                  <select id="f-type" name="type">
                    <option>Runway show</option>
                    <option>Editorial shoot</option>
                    <option>Commercial campaign</option>
                    <option>Acting &mdash; screen or stage</option>
                    <option>Event appearance</option>
                    <option>Something else</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-msg">Message</label>
                  <textarea id="f-msg" name="message" rows={3}></textarea>
                </div>
                <div className={styles.submit}>
                  <button type="submit">Send enquiry</button>
                  <p className={styles.thanks} role="status" aria-live="polite" hidden={!sent}>
                    Thank you &mdash; this is a design preview, so nothing was sent.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles["foot-top"]}>
            <p className={styles["foot-mark"]}>
              Chaithrika<em>.</em>
            </p>
            <ul className={styles["foot-links"]}>
              <li>
                <a className={cx("label", "ul")} href="#categories">
                  Modeling
                </a>
              </li>
              <li>
                <a className={cx("label", "ul")} href="#categories">
                  Acting
                </a>
              </li>
              <li>
                <a className={cx("label", "ul")} href="#work">
                  Work
                </a>
              </li>
              <li>
                <a className={cx("label", "ul")} href="#">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div className={styles["foot-bot"]}>
            <p className={styles.label}>&copy; 2026 Charming Chaithrika &middot; Bookings via her parents</p>
            <div className={styles["foot-design"]}>
              <p className={styles.label}>Design option 01 of 10 &mdash; Luxury Minimal</p>
              <Link className={cx("label", "ul")} href="/designs">
                View all designs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
