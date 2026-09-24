"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./design.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Class list for a scroll-fade element, with an optional stagger delay (1-3). */
const fade = (delay?: 1 | 2 | 3, ...extra: string[]) =>
  cx(styles.fade, delay && styles[`d${delay}`], ...extra);

const NAV = [
  ["#modeling", "Modeling"],
  ["#acting", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
  ["#contact", "Contact"],
] as const;

const GALLERY_SIZES = "(max-width: 560px) 420px, (max-width: 900px) 50vw, 380px";

type Shot = {
  name: Parameters<typeof designImage>[0];
  alt: string;
  frame: "archF" | "soft" | "short";
  caption: string;
  tag: string;
};

const COLUMNS: { delay?: 1 | 2; shots: Shot[] }[] = [
  {
    shots: [
      {
        name: "fairy",
        alt: "Chaithrika in a white tulle dress with fairy wings",
        frame: "archF",
        caption: "Tulle & wings",
        tag: "Studio",
      },
      {
        name: "park",
        alt: "Chaithrika in a yellow tee with an owl backpack on a red park bench",
        frame: "soft",
        caption: "An afternoon off",
        tag: "Lifestyle",
      },
    ],
  },
  {
    delay: 1,
    shots: [
      {
        name: "teal-lehenga",
        alt: "Chaithrika in a green blouse, orange silk lehenga and teal dupatta",
        frame: "soft",
        caption: "Silk heirlooms",
        tag: "Heritage",
      },
      {
        name: "red-peplum",
        alt: "Chaithrika smiling in a red brocade peplum top and pink skirt",
        frame: "archF",
        caption: "Brocade & blush",
        tag: "Studio",
      },
    ],
  },
  {
    delay: 2,
    shots: [
      {
        name: "green-gown",
        alt: "Chaithrika holding out a dark green gown, wearing a tiara, palm leaves behind",
        frame: "archF",
        caption: "Emerald afternoon",
        tag: "Outdoor",
      },
      {
        name: "orange-flowers",
        alt: "Chaithrika in an orange dress with 3D flowers, hands on hips",
        frame: "short",
        caption: "In full bloom",
        tag: "Studio",
      },
    ],
  },
];

function Arrow() {
  return <span className={styles.arrow}></span>;
}

export default function Design8({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#EFE8DF");

  const rootRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  // Scroll fades (the template's html.js behaviour) and page-level scroll settings.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    const prevPadding = html.style.scrollPaddingTop;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollPaddingTop = "88px";

    root.classList.add(styles.ready);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) html.style.scrollBehavior = "auto";

    const els = root.querySelectorAll<HTMLElement>(`.${styles.fade}`);
    let io: IntersectionObserver | undefined;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add(styles.in));
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
        { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
      );
      els.forEach((el) => observer.observe(el));
      io = observer;
    }

    return () => {
      io?.disconnect();
      root.classList.remove(styles.ready);
      html.style.scrollPaddingTop = prevPadding;
      html.style.scrollBehavior = prevBehavior;
    };
  }, []);

  // Drawer: Escape closes and returns focus; widening past the breakpoint closes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMsg("Thank you — this is a design preview, so nothing was sent.");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={rootRef} className={cx(styles.root, fontClassName)}>
      <header className={styles.nav}>
        <div className={styles.wrap}>
          <a className={styles.logo} href="#top" aria-label="Charming Chaithrika, home">
            <span className={styles.it}>charming</span>
            <b>Chaithrika</b>
          </a>
          <ul className={styles.links}>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <a className={cx(styles.btn, styles.btnDark)} href="#contact">
            Book
          </a>
          <button
            ref={burgerRef}
            className={styles.burger}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="drawer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <i></i>
            <i></i>
          </button>
        </div>
        <nav className={styles.drawer} id="drawer" aria-label="Mobile" hidden={!menuOpen}>
          <ul>
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a className={cx(styles.btn, styles.btnDark)} href="#contact" onClick={closeMenu}>
            Book an enquiry <Arrow />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.wrap}>
            <div>
              <p className={styles.kicker}>
                <span className={styles.it}>Child model &amp; actress</span>India
              </p>
              <h1 id="hero-title">
                Grace, in every frame. <span className={styles.it}>Meet Chaithrika.</span>
              </h1>
              <p className={styles.heroText}>
                From the runway at India Kids Fashion Week to campaigns for Amazon Kids Dress, she
                brings a quiet confidence and a natural sense of story to every brief.
              </p>
              <div className={styles.heroCta}>
                <a className={cx(styles.btn, styles.btnDark)} href="#contact">
                  Book an enquiry <Arrow />
                </a>
                <a className={cx(styles.btn, styles.btnSoft)} href="#gallery">
                  View portfolio
                </a>
              </div>
              <ul className={styles.disc} aria-label="Disciplines">
                <li>Runway</li>
                <li>Editorial</li>
                <li>Commercial</li>
                <li>Acting</li>
              </ul>
            </div>
            <div className={styles.heroArt}>
              <div className={cx(styles.arch, styles.heroMain)}>
                <Image
                  {...designImage("white-chair")}
                  alt="Chaithrika in a white tulle dress seated on a white folding chair against a soft backdrop with pink hearts"
                  sizes="(max-width: 900px) 90vw, 460px"
                  preload
                />
              </div>
              <div className={cx(styles.arch, styles.heroSmall)}>
                <Image
                  {...designImage("garden")}
                  alt="Chaithrika in a black and gold half-saree in a flowering garden, smiling shyly"
                  sizes="(max-width: 900px) 42vw, 250px"
                  loading="eager"
                />
              </div>
              <p className={styles.heroTag}>
                <span className={styles.it}>IKFW Season 11</span>
                <small>Runway · 2024</small>
              </p>
            </div>
          </div>
        </section>

        <section className={cx(styles.sec, styles.about)} id="about" aria-labelledby="about-title">
          <div className={styles.wrap}>
            <div className={fade(undefined, styles.aboutImg)}>
              <Image
                {...designImage("navy-ethnic")}
                alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"
                sizes="(max-width: 480px) 100vw, 480px"
              />
            </div>
            <div>
              <p className={fade(undefined, styles.kicker)}>
                <span className={styles.it}>About</span>Her story
              </p>
              <h2 className={fade(1, styles.h2)} id="about-title">
                A natural sense of movement and story.
              </h2>
              <p className={fade(2, styles.lede)}>
                From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings
                confidence, creativity, and expressive performance to every brief.
              </p>
              <p className={fade(2, styles.lede)}>
                Her work blends clean camera presence with a gentle ease in front of the lens,
                whether the brief calls for couture, heritage or play.
              </p>
              <ul className={fade(3, styles.craft)}>
                <li>
                  <b>Runway</b>
                  <span className={styles.it}>poise</span>
                </li>
                <li>
                  <b>Editorial</b>
                  <span className={styles.it}>stillness</span>
                </li>
                <li>
                  <b>Commercial</b>
                  <span className={styles.it}>warmth</span>
                </li>
                <li>
                  <b>Acting</b>
                  <span className={styles.it}>story</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.sec} aria-labelledby="cats-title">
          <div className={styles.wrap}>
            <div className={styles.catsHead}>
              <div>
                <p className={fade(undefined, styles.kicker)}>
                  <span className={styles.it}>Portfolio</span>Two crafts
                </p>
                <h2 className={fade(1, styles.h2)} id="cats-title" style={{ marginTop: 20 }}>
                  One gentle presence.
                </h2>
              </div>
              <p className={fade(2, styles.lede)}>
                Two ways of working, each with its own discipline, and the same calm focus in both.
              </p>
            </div>
            <div className={styles.cats}>
              <a className={fade(undefined, styles.cat)} id="modeling" href="#gallery">
                <div className={styles.arch}>
                  <Image
                    {...designImage("blue-gown")}
                    alt="Chaithrika in a teal-blue rose ball gown, hand on hip, against a pink backdrop"
                    sizes="(max-width: 700px) 100vw, 560px"
                    style={{ objectPosition: "50% 22%" }}
                  />
                </div>
                <div className={styles.catBody}>
                  <div>
                    <h3>Modeling</h3>
                    <p className={styles.it} style={{ fontSize: 20 }}>
                      Runway · Editorial · Fashion campaigns
                    </p>
                  </div>
                  <span className={styles.round} aria-hidden="true">
                    <Arrow />
                  </span>
                </div>
              </a>
              <a className={fade(1, styles.cat)} id="acting" href="#contact">
                <div className={styles.arch}>
                  <Image
                    {...designImage("saree")}
                    alt="Chaithrika in an orange and green traditional outfit, leaning on a tree and looking up"
                    sizes="(max-width: 700px) 100vw, 560px"
                    style={{ objectPosition: "50% 30%" }}
                  />
                </div>
                <div className={styles.catBody}>
                  <div>
                    <h3>Acting</h3>
                    <p className={styles.it} style={{ fontSize: 20 }}>
                      Screen · Stage · Performance
                    </p>
                  </div>
                  <span className={styles.round} aria-hidden="true">
                    <Arrow />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className={cx(styles.sec, styles.featured)} id="work" aria-labelledby="work-title">
          <div className={styles.wrap}>
            <div className={styles.galHead}>
              <p className={fade(undefined, styles.kicker)}>
                <span className={styles.it}>Featured</span>Selected work
              </p>
              <h2 className={fade(1, styles.h2)} id="work-title" style={{ marginTop: 20 }}>
                Moments worth remembering.
              </h2>
            </div>

            <article className={styles.feat}>
              <div className={fade(undefined, styles.featArt)}>
                <div className={styles.featWide}>
                  <Image
                    {...designImage("runway")}
                    alt="Chaithrika on the IKFW runway in a kalamkari crop top and mint striped lehenga under stage lights"
                    sizes="(max-width: 560px) 100vw, 600px"
                  />
                </div>
                <div className={cx(styles.arch, styles.featInset)}>
                  <Image
                    {...designImage("backstage")}
                    alt="Chaithrika backstage at IKFW, looking into a bulb-lit makeup mirror"
                    sizes="(max-width: 560px) 38vw, 240px"
                  />
                </div>
              </div>
              <div>
                <p className={fade(undefined, styles.meta)}>
                  <span>Runway show</span>
                  <span>Dec 18, 2024</span>
                </p>
                <h3 className={fade(1)}>India Kids Fashion Week, Season 11</h3>
                <p className={fade(2, styles.lede)}>
                  A poised walk at IKFW Season 11 with expressive stage presence, graceful movement,
                  and a memorable runway finish.
                </p>
              </div>
            </article>

            <article className={cx(styles.feat, styles.featFlip)}>
              <div className={fade(undefined, styles.featArt)} style={{ paddingBottom: 0 }}>
                <div className={cx(styles.arch, styles.featArch)}>
                  <Image
                    {...designImage("floral-lehenga")}
                    alt="Chaithrika twirling in a maroon embellished top and cream floral skirt on a pink backdrop"
                    sizes="(max-width: 500px) 100vw, 460px"
                  />
                </div>
              </div>
              <div>
                <p className={fade(undefined, styles.meta)}>
                  <span>Brand photoshoot</span>
                  <span>Bangalore · 2024</span>
                </p>
                <h3 className={fade(1)}>Pinnacle Business Park</h3>
                <p className={fade(2, styles.lede)}>
                  A brand campaign shot at one of Bangalore&apos;s premier business destinations,
                  balancing couture, confidence, and polished camera presence.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.sec} id="gallery" aria-labelledby="gal-title">
          <div className={styles.wrap}>
            <div className={styles.galHead}>
              <p className={fade(undefined, styles.kicker)}>
                <span className={styles.it}>Gallery</span>Portfolio
              </p>
              <h2 className={fade(1, styles.h2)} id="gal-title" style={{ marginTop: 20 }}>
                Softly, in her own light.
              </h2>
              <p className={fade(2, styles.lede)}>
                Studio couture, heritage wear and easy everyday moments.
              </p>
            </div>
            <div className={styles.gallery}>
              {COLUMNS.map((col, i) => (
                <div className={styles.gcol} key={i}>
                  {col.shots.map((s) => (
                    <figure className={fade(col.delay, styles.g)} key={s.name}>
                      <div className={cx(styles.frame, styles[s.frame])}>
                        <Image {...designImage(s.name)} alt={s.alt} sizes={GALLERY_SIZES} />
                      </div>
                      <figcaption>
                        <span className={styles.it}>{s.caption}</span>
                        <small>{s.tag}</small>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.quoteWrap}>
          <div className={styles.wrap}>
            <figure className={fade(undefined, styles.quote)}>
              <span className={styles.mark} aria-hidden="true">
                “
              </span>
              <blockquote>
                <p>
                  Modeling and acting both ask for presence. I love the challenge each one brings.
                </p>
              </blockquote>
              <figcaption>Chaithrika</figcaption>
            </figure>
          </div>
        </div>

        <section
          className={cx(styles.sec, styles.enquire)}
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className={styles.wrap}>
            <div>
              <p className={fade(undefined, styles.kicker)}>
                <span className={styles.it}>Enquiries</span>Bookings
              </p>
              <h2 className={fade(1, styles.h2)} id="contact-title">
                Let&apos;s create something beautiful together.
              </h2>
              <p className={fade(2, styles.lede)}>
                For runway, campaigns, editorials and acting roles. Bookings are lovingly managed by
                her parents.
              </p>
              <p className={fade(2, styles.avail)}>Available for bookings</p>
              <div className={fade(3, styles.arch, styles.enqImg)}>
                <Image
                  {...designImage("yellow-jeep")}
                  alt="Chaithrika in a yellow butterfly sweatshirt stepping out of a jeep"
                  sizes="260px"
                />
              </div>
            </div>
            <form id="enquiry" className={fade(1, styles.form)} noValidate onSubmit={onSubmit}>
              <div className={styles.field}>
                <label htmlFor="e-name">Your name</label>
                <input
                  id="e-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="e-company">Brand / company</label>
                <input
                  id="e-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Label, studio or agency"
                />
              </div>
              <div className={cx(styles.field, styles.fieldFull)}>
                <label htmlFor="e-type">Project type</label>
                <select id="e-type" name="type">
                  <option>Runway show</option>
                  <option>Editorial shoot</option>
                  <option>Brand campaign</option>
                  <option>E-commerce</option>
                  <option>Acting — screen or stage</option>
                  <option>Event appearance</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className={cx(styles.field, styles.fieldFull)}>
                <label htmlFor="e-msg">Message</label>
                <textarea
                  id="e-msg"
                  name="message"
                  placeholder="Share the dates, location and a little about the brief"
                ></textarea>
              </div>
              <div className={styles.formFoot}>
                <button className={cx(styles.btn, styles.btnDark)} type="submit">
                  Send enquiry <Arrow />
                </button>
                <p className={styles.formMsg} id="e-status" role="status" aria-live="polite">
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
            <p className={styles.footName}>
              <span className={styles.it}>charming</span>Chaithrika
            </p>
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
          </div>
          <div className={styles.footBottom}>
            <span>© 2026 Chaithrika · Child model &amp; actress, India</span>
            <span className={styles.footDesign}>
              <span>Design option 08 of 10 — Premium Soft Aesthetic</span>
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
