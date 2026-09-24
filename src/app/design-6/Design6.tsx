"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./design.module.css";

/** Join CSS-module class names. */
const cx = (...names: string[]) => names.map((n) => styles[n]).join(" ");

const NAV = [
  { href: "#portfolio", label: "Modeling", tag: "Portfolio" },
  { href: "#portfolio", label: "Acting", tag: "Portfolio" },
  { href: "#work", label: "Work", tag: "Selected" },
  { href: "#about", label: "About", tag: "Profile" },
  { href: "#contact", label: "Contact", tag: "Book" },
];

const GALLERY_SIZES = {
  ga: "(max-width: 440px) 100vw, (max-width: 960px) 50vw, (max-width: 1320px) 32vw, 420px",
  gb: "(max-width: 440px) 100vw, (max-width: 960px) 50vw, (max-width: 1320px) 24vw, 310px",
  gw: "(max-width: 960px) 100vw, (max-width: 1320px) 48vw, 630px",
};

export default function Design6({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#FFFFFF");

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
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
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
          <a className={styles.brand} href="#top" aria-label="Chaithrika, home">
            <span className={styles.mk} aria-hidden="true">
              C
            </span>
            <span className={styles.nm}>
              Chaithrika<small>Child model &amp; actress</small>
            </span>
          </a>
          <nav aria-label="Primary">
            <ul className={styles["nav-links"]}>
              {NAV.map((n) => (
                <li key={n.label}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles["nav-cta"]}>
            <a className={cx("btn", "btn-brass")} href="#contact">
              Book
            </a>
            <button
              ref={menuBtnRef}
              className={styles["menu-btn"]}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menuPanel"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <i aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className={styles.panel} id="menuPanel" hidden={!menuOpen}>
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href} onClick={closeMenu}>
                  {n.label} <span>{n.tag}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="heroTitle">
          <div className={styles.wrap}>
            <div className={styles["hero-in"]}>
              <div className={styles["hero-copy"]}>
                <div>
                  <p className={styles.eyebrow}>Talent profile &middot; India</p>
                  <h1 id="heroTitle">
                    Chaithrika &mdash; runway, editorial and screen talent,{" "}
                    <em>ready for your next brief.</em>
                  </h1>
                  <p className={styles["hero-lede"]}>
                    A confident, expressive child model and actress with runway experience at India Kids Fashion
                    Week and campaign work for leading kidswear. Bookings are managed personally by her parents.
                  </p>
                  <div className={styles["hero-actions"]}>
                    <a className={cx("btn", "btn-brass")} href="#contact">
                      Request availability <span className={styles.arr} aria-hidden="true"></span>
                    </a>
                    <a className={cx("btn", "btn-line")} href="#portfolio">
                      View portfolio
                    </a>
                  </div>
                </div>
                <dl className={styles["hero-facts"]}>
                  <div>
                    <dt>Runway</dt>
                    <dd>IKFW Season 11</dd>
                  </div>
                  <div>
                    <dt>Campaign</dt>
                    <dd>Amazon Kids Dress</dd>
                  </div>
                  <div>
                    <dt>Bookings</dt>
                    <dd>Open</dd>
                  </div>
                </dl>
              </div>
              <figure className={styles["hero-photo"]}>
                <Image
                  {...designImage("orange-flowers")}
                  alt="Chaithrika in an orange dress with sculpted flowers, standing with hands on hips against a grey studio backdrop"
                  sizes="(max-width: 960px) 100vw, (max-width: 1320px) 46vw, 600px"
                  preload
                />
                <figcaption>
                  <span className={styles.mono}>Studio</span>
                  <span>Orange floral couture</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className={styles.creds} aria-label="Credentials">
          <div className={styles.wrap}>
            <div className={styles["creds-in"]}>
              <p className={cx("creds-lbl", "eyebrow")}>Credentials</p>
              <div className={styles.cred}>
                <strong>India Kids Fashion Week</strong>
                <span>Season 11 &middot; Runway, Dec 18, 2024</span>
              </div>
              <div className={styles.cred}>
                <strong>Amazon Kids Dress</strong>
                <span>Modelling &middot; Kidswear</span>
              </div>
              <div className={styles.cred}>
                <strong>Pinnacle Business Park</strong>
                <span>Brand photoshoot &middot; Bangalore, 2024</span>
              </div>
            </div>
          </div>
        </section>

        <section className={cx("sec", "profile")} id="about" aria-labelledby="aboutTitle">
          <div className={styles.wrap}>
            <div className={styles.grid}>
              <div className={cx("bio", "rv")}>
                <p className={styles.eyebrow}>About</p>
                <h2 id="aboutTitle" className={styles.h2}>
                  Clean camera presence. A natural sense of story.
                </h2>
                <p className={styles.big}>
                  From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence,
                  creativity, and expressive performance to every brief.
                </p>
                <p>
                  Her work blends clean camera presence with a natural sense of movement and story &mdash; the
                  reason she moves as comfortably between a studio set and a live runway as she does between
                  modeling and acting.
                </p>
                <div className={styles["bio-photo"]}>
                  <Image
                    {...designImage("garden")}
                    alt="Chaithrika in a traditional black and gold half-saree in a flowering garden, smiling"
                    sizes="(max-width: 960px) 100vw, (max-width: 1320px) 40vw, 520px"
                  />
                </div>
              </div>
              <aside className={cx("sheet", "rv")} aria-labelledby="sheetTitle">
                <div className={styles["sheet-head"]}>
                  <h3 id="sheetTitle">Talent profile sheet</h3>
                  <span className={styles.mono}>Ref. CC&middot;2024</span>
                </div>
                <dl>
                  <div className={styles.row}>
                    <dt>Name</dt>
                    <dd>Chaithrika &mdash; &ldquo;Charming Chaithrika&rdquo;</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Based</dt>
                    <dd>India</dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Disciplines</dt>
                    <dd>
                      <div className={styles.tags}>
                        <span>Runway</span>
                        <span>Editorial</span>
                        <span>Commercial</span>
                        <span>Acting</span>
                      </div>
                    </dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Categories</dt>
                    <dd>
                      <strong className={styles.strong}>Modeling</strong> &mdash; Runway, Editorial, Fashion
                      campaigns
                      <br />
                      <strong className={styles.strong}>Acting</strong> &mdash; Screen, Stage, Performance
                    </dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Recent work</dt>
                    <dd>
                      <ul>
                        <li>
                          <span className={styles.date}>Dec 18, 2024</span>India Kids Fashion Week, Season 11
                          &mdash; Runway
                        </li>
                        <li>
                          <span className={styles.date}>2024</span>Pinnacle Business Park &mdash; Brand photoshoot
                        </li>
                        <li>
                          <span className={styles.date}>Campaign</span>Amazon Kids Dress &mdash; Modelling
                        </li>
                      </ul>
                    </dd>
                  </div>
                  <div className={styles.row}>
                    <dt>Availability</dt>
                    <dd>Open for bookings</dd>
                  </div>
                </dl>
                <p className={styles["sheet-foot"]}>Bookings managed by her parents.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className={cx("sec", "cats")} id="portfolio" aria-labelledby="portTitle">
          <div className={styles.wrap}>
            <div className={styles["split-head"]}>
              <div>
                <p className={styles.eyebrow}>Portfolio</p>
                <h2 id="portTitle" className={styles.h2}>
                  Two practices, one professional standard.
                </h2>
              </div>
              <p>
                Whether the brief is a kidswear campaign or a character on screen, the same preparation and
                presence go into every booking.
              </p>
            </div>
            <div className={styles["cat-grid"]}>
              <a className={cx("cat", "rv")} href="#gallery">
                <div className={styles.ph}>
                  <Image
                    {...designImage("blue-gown")}
                    alt="Chaithrika in a teal-blue rose ball gown with a hand on her hip against a pink backdrop"
                    sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, (max-width: 1320px) 22vw, 290px"
                  />
                </div>
                <div className={styles["cat-body"]}>
                  <div>
                    <p className={cx("mono", "practice")}>Practice A</p>
                    <h3>Modeling</h3>
                    <ul>
                      <li>Runway</li>
                      <li>Editorial</li>
                      <li>Fashion campaigns</li>
                    </ul>
                  </div>
                  <span className={styles.go}>
                    See modeling work <span className={styles.arr} aria-hidden="true"></span>
                  </span>
                </div>
              </a>
              <a className={cx("cat", "rv")} href="#gallery">
                <div className={styles.ph}>
                  <Image
                    {...designImage("saree")}
                    alt="Chaithrika in an orange and green traditional outfit, leaning on a tree and looking up expressively"
                    sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, (max-width: 1320px) 22vw, 290px"
                  />
                </div>
                <div className={styles["cat-body"]}>
                  <div>
                    <p className={cx("mono", "practice")}>Practice B</p>
                    <h3>Acting</h3>
                    <ul>
                      <li>Screen</li>
                      <li>Stage</li>
                      <li>Performance</li>
                    </ul>
                  </div>
                  <span className={styles.go}>
                    See acting work <span className={styles.arr} aria-hidden="true"></span>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.sec} id="work" aria-labelledby="workTitle">
          <div className={styles.wrap}>
            <div className={styles["sec-head"]}>
              <p className={styles.eyebrow}>Selected work</p>
              <h2 id="workTitle">Recent engagements</h2>
            </div>
            <div className={styles["work-list"]}>
              <article className={cx("case", "rv")}>
                <div className={styles["case-meta"]}>
                  <span className={styles.mono}>Runway show</span>
                  <span className={cx("mono", "date")}>Dec 18, 2024</span>
                </div>
                <div className={styles["case-body"]}>
                  <h3>India Kids Fashion Week &mdash; Season 11</h3>
                  <p>
                    A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a
                    memorable runway finish.
                  </p>
                  <div className={styles.kv}>
                    <div>
                      <span>Format</span>Live runway
                    </div>
                    <div>
                      <span>Look</span>Kalamkari &amp; mint lehenga
                    </div>
                  </div>
                </div>
                <div className={styles["case-img"]}>
                  <Image
                    {...designImage("runway")}
                    alt="Chaithrika on the IKFW runway in a kalamkari crop top and mint striped lehenga under stage lights"
                    sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, (max-width: 1320px) 40vw, 530px"
                  />
                </div>
              </article>
              <article className={cx("case", "rv")}>
                <div className={styles["case-meta"]}>
                  <span className={styles.mono}>Brand photoshoot</span>
                  <span className={cx("mono", "date")}>2024</span>
                </div>
                <div className={styles["case-body"]}>
                  <h3>Pinnacle Business Park, Bangalore</h3>
                  <p>
                    A brand campaign shot at one of Bangalore&apos;s premier business destinations, balancing
                    couture, confidence, and polished camera presence.
                  </p>
                  <div className={styles.kv}>
                    <div>
                      <span>Format</span>Brand campaign
                    </div>
                    <div>
                      <span>Location</span>Bangalore
                    </div>
                  </div>
                </div>
                <div className={styles["case-img"]}>
                  <Image
                    {...designImage("red-peplum")}
                    alt="Chaithrika smiling in a red brocade peplum top and pink skirt against a pink backdrop"
                    sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, (max-width: 1320px) 40vw, 530px"
                    className={styles.pos22}
                  />
                </div>
              </article>
            </div>
            <p className={cx("also", "rv")}>
              <span className={styles.mono}>Also</span> Modelled for Amazon Kids Dress.
            </p>
          </div>
        </section>

        <section className={cx("sec", "gallery")} id="gallery" aria-labelledby="galTitle">
          <div className={styles.wrap}>
            <div className={styles["split-head"]}>
              <div>
                <p className={styles.eyebrow}>Gallery</p>
                <h2 id="galTitle" className={styles.h2}>
                  Range across studio, stage and location.
                </h2>
              </div>
              <p>A cross-section of recent looks &mdash; couture, festive, traditional and lifestyle.</p>
            </div>
            <div className={styles.gal}>
              <figure className={cx("ga", "rv")}>
                <div className={styles.ph}>
                  <Image
                    {...designImage("teal-lehenga")}
                    alt="Chaithrika in a green blouse, orange silk lehenga and teal dupatta against grey"
                    sizes={GALLERY_SIZES.ga}
                  />
                </div>
                <figcaption>
                  Festive silk<span className={styles.mono}>Studio</span>
                </figcaption>
              </figure>
              <figure className={cx("ga", "rv")}>
                <div className={styles.ph}>
                  <Image
                    {...designImage("floral-lehenga")}
                    alt="Chaithrika twirling in a maroon top and cream floral skirt on a pink backdrop"
                    sizes={GALLERY_SIZES.ga}
                  />
                </div>
                <figcaption>
                  Floral twirl<span className={styles.mono}>Studio</span>
                </figcaption>
              </figure>
              <figure className={cx("ga", "rv")}>
                <div className={styles.ph}>
                  <Image
                    {...designImage("white-chair")}
                    alt="Chaithrika in a white tulle dress seated on a white chair"
                    sizes={GALLERY_SIZES.ga}
                  />
                </div>
                <figcaption>
                  White tulle<span className={styles.mono}>Editorial</span>
                </figcaption>
              </figure>
              <figure className={cx("gw", "rv")}>
                <div className={styles.ph}>
                  <Image
                    {...designImage("backstage")}
                    alt="Chaithrika backstage at IKFW, looking into a bulb-lit makeup mirror"
                    sizes={GALLERY_SIZES.gw}
                    className={styles.pos40}
                  />
                </div>
                <figcaption>
                  Backstage, IKFW<span className={styles.mono}>Season 11</span>
                </figcaption>
              </figure>
              <figure className={cx("gb", "rv")}>
                <div className={styles.ph}>
                  <Image
                    {...designImage("navy-ethnic")}
                    alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"
                    sizes={GALLERY_SIZES.gb}
                  />
                </div>
                <figcaption>
                  Navy ethnic<span className={styles.mono}>Location</span>
                </figcaption>
              </figure>
              <figure className={cx("gb", "rv")}>
                <div className={styles.ph}>
                  <Image
                    {...designImage("green-gown")}
                    alt="Chaithrika in a dark green gown and tiara, holding the skirt wide before palm leaves"
                    sizes={GALLERY_SIZES.gb}
                  />
                </div>
                <figcaption>
                  Emerald gown<span className={styles.mono}>Location</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className={styles.sec} id="process" aria-labelledby="procTitle">
          <div className={styles.wrap}>
            <div className={styles["split-head"]}>
              <div>
                <p className={styles.eyebrow}>How booking works</p>
                <h2 id="procTitle" className={styles.h2}>
                  Three clear steps from enquiry to shoot day.
                </h2>
              </div>
              <p>
                A simple, family-managed process so brands and casting teams always know who they are speaking
                to and what happens next.
              </p>
            </div>
            <ol className={styles.steps}>
              <li className={cx("step", "rv")}>
                <span className={styles.num}>01</span>
                <h3>Enquiry</h3>
                <p>
                  Send a short note with the brand, project type, dates and usage. Her parents review every
                  request personally.
                </p>
                <p className={styles.note}>Via the form below</p>
              </li>
              <li className={cx("step", "rv")}>
                <span className={styles.num}>02</span>
                <h3>Brief &amp; availability</h3>
                <p>
                  We confirm availability, talk through the brief, wardrobe and schedule, and agree the details
                  before anything is booked.
                </p>
                <p className={styles.note}>Confirmed in writing</p>
              </li>
              <li className={cx("step", "rv")}>
                <span className={styles.num}>03</span>
                <h3>Shoot day</h3>
                <p>
                  Chaithrika arrives prepared and on time &mdash; always accompanied by a parent or guardian, who
                  stays on set throughout.
                </p>
                <p className={styles.note}>Guardian always on set</p>
              </li>
            </ol>
          </div>
        </section>

        <section className={cx("sec", "safe")} aria-labelledby="safeTitle">
          <div className={styles.wrap}>
            <div className={styles.grid}>
              <div className={cx("safe-intro", "rv")}>
                <p className={styles.eyebrow}>Safeguarding &amp; professionalism</p>
                <h2 id="safeTitle" className={styles["h2-safe"]}>
                  Our family&apos;s standards for every booking.
                </h2>
                <p>
                  These are the ground rules her parents apply to every project. They keep sets calm, focused and
                  happy &mdash; which is when the best work happens.
                </p>
              </div>
              <ul className={cx("safe-list", "rv")}>
                <li>
                  <strong>Guardian present</strong>
                  <span>
                    A parent or guardian accompanies Chaithrika to every fitting, rehearsal and shoot, and remains
                    on set throughout.
                  </span>
                </li>
                <li>
                  <strong>Age-appropriate briefs</strong>
                  <span>
                    Wardrobe, styling, themes and scripts are reviewed in advance to make sure they suit a child
                    performer.
                  </span>
                </li>
                <li>
                  <strong>Reasonable hours</strong>
                  <span>
                    Call times and schedules are agreed beforehand, with regular breaks, meals and rest built into
                    the day.
                  </span>
                </li>
                <li>
                  <strong>Clear communication</strong>
                  <span>One point of contact &mdash; her parents &mdash; from first enquiry through to wrap.</span>
                </li>
              </ul>
            </div>
            <div className={cx("safe-quote", "rv")}>
              <span className={styles.qm} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>
                <p>Modeling and acting both ask for presence. I love the challenge each one brings.</p>
                <cite>Chaithrika</cite>
              </blockquote>
            </div>
          </div>
        </section>

        <section className={cx("sec", "contact")} id="contact" aria-labelledby="contactTitle">
          <div className={styles.wrap}>
            <div className={styles.grid}>
              <div className={styles["c-intro"]}>
                <p className={styles.eyebrow}>Bookings</p>
                <h2 id="contactTitle">Let&apos;s create something beautiful together.</h2>
                <p>
                  Share a few details about your project and her parents will respond with availability and next
                  steps.
                </p>
                <dl className={styles["c-list"]}>
                  <div>
                    <dt>Status</dt>
                    <dd className={styles.status}>Available for bookings</dd>
                  </div>
                  <div>
                    <dt>Managed by</dt>
                    <dd>Her parents</dd>
                  </div>
                  <div>
                    <dt>Open to</dt>
                    <dd>Runway, editorial, commercial, acting</dd>
                  </div>
                </dl>
              </div>
              <form className={styles.form} id="enquiry" noValidate onSubmit={onSubmit}>
                <div className={styles["form-head"]}>
                  <h3>Booking enquiry</h3>
                  <span className={styles.mono}>Step 01 &mdash; Enquiry</span>
                </div>
                <div className={styles.fg}>
                  <div className={styles.field}>
                    <label htmlFor="f-name">Your name</label>
                    <input id="f-name" name="name" type="text" autoComplete="name" />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="f-company">Brand / company</label>
                    <input id="f-company" name="company" type="text" autoComplete="organization" />
                  </div>
                  <div className={cx("field", "full")}>
                    <label htmlFor="f-type">Project type</label>
                    <select id="f-type" name="type">
                      <option>Runway show</option>
                      <option>Editorial shoot</option>
                      <option>Commercial / brand campaign</option>
                      <option>Acting &mdash; screen</option>
                      <option>Acting &mdash; stage</option>
                      <option>Event appearance</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className={cx("field", "full")}>
                    <label htmlFor="f-msg">Message</label>
                    <textarea
                      id="f-msg"
                      name="message"
                      placeholder="Dates, location, usage and anything else we should know."
                    ></textarea>
                  </div>
                </div>
                <div className={styles["form-foot"]}>
                  <small>Every enquiry is read personally by her parents.</small>
                  <button className={cx("btn", "btn-navy")} type="submit">
                    Send enquiry <span className={styles.arr} aria-hidden="true"></span>
                  </button>
                </div>
                <p className={styles.thanks} role="status" aria-live="polite" hidden={!sent}>
                  Thank you &mdash; this is a design preview, so nothing was sent.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles["f-top"]}>
            <div className={styles["f-brand"]}>
              <a className={styles.brand} href="#top" aria-label="Chaithrika, back to top">
                <span className={styles.mk} aria-hidden="true">
                  C
                </span>
                <span className={styles.nm}>
                  Charming Chaithrika<small>Child model &amp; actress</small>
                </span>
              </a>
              <p>Runway &middot; Editorial &middot; Commercial &middot; Acting. Bookings managed by her parents.</p>
            </div>
            <div className={styles["f-col"]}>
              <h4>Portfolio</h4>
              <ul>
                <li>
                  <a href="#portfolio">Modeling</a>
                </li>
                <li>
                  <a href="#portfolio">Acting</a>
                </li>
                <li>
                  <a href="#gallery">Gallery</a>
                </li>
              </ul>
            </div>
            <div className={styles["f-col"]}>
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#work">Work</a>
                </li>
                <li>
                  <a href="#process">How booking works</a>
                </li>
              </ul>
            </div>
            <div className={styles["f-col"]}>
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href="#contact">Book</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles["f-bot"]}>
            <span>&copy; 2026 Charming Chaithrika</span>
            <span className={styles["f-design"]}>
              <span>Design option 06 of 10 &mdash; Luxury Corporate</span>
              <Link href="/designs">View all designs</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
