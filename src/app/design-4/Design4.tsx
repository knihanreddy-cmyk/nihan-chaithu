"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import s from "./design.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const NAV_LINKS: [string, string][] = [
  ["#portfolio", "Modeling"],
  ["#portfolio", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
];

const GALLERY = [
  { name: "white-chair", ratio: "r23", alt: "Chaithrika in a white tulle dress seated on a white folding chair, soft pink hearts behind", caption: "Studio · Soft white" },
  { name: "garden", ratio: "r34", alt: "Chaithrika in a black and gold half-saree smiling shyly in a flowering garden", caption: "Outdoor · Traditional" },
  { name: "orange-flowers", ratio: "r23", alt: "Chaithrika in an orange dress with 3D flowers, hands on hips, on a grey backdrop", caption: "Studio · Colour" },
  { name: "backstage", ratio: "r34", alt: "Chaithrika backstage at IKFW looking into a bulb-lit makeup mirror, event lanyard around her neck", caption: "Backstage · IKFW", pos: "pos40" },
  { name: "teal-lehenga", ratio: "r23", alt: "Chaithrika in a green blouse, orange silk lehenga and teal dupatta, looking off to the side", caption: "Studio · Festive" },
  { name: "green-gown", ratio: "r45", alt: "Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind", caption: "Outdoor · Gown" },
  { name: "navy-ethnic", ratio: "r34", alt: "Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds", caption: "Outdoor · Quiet" },
  { name: "fairy", ratio: "r23", alt: "Chaithrika in a white tulle dress with fairy wings on a grey backdrop", caption: "Studio · Character" },
  { name: "park", ratio: "r34", alt: "Chaithrika in a yellow tee with an owl backpack on a red park bench, shot from a low angle", caption: "Lifestyle · Play" },
] as const;

const GALLERY_SIZES = "(max-width: 900px) calc(50vw - 32px), min(400px, 30vw)";

export default function Design4({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#F4EEF3");

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  // Mobile nav: Escape closes (and returns focus), widening past the breakpoint closes.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [navOpen]);

  // Reveals (JS-gated through .ready on the root, so SSR content stays visible without JS).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add(s.ready);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = root.querySelectorAll<HTMLElement>(`.${CSS.escape(s.reveal)}`);
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add(s.in));
      return () => root.classList.remove(s.ready);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add(s.in);
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove(s.ready);
    };
  }, []);

  // Pointer parallax on hero chips (max 12px).
  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const chips = Array.from(stage.querySelectorAll<HTMLElement>("[data-depth]"));
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      chips.forEach((c) => {
        const d = parseFloat(c.dataset.depth ?? "0");
        c.style.transform = `translate3d(${(x * d).toFixed(1)}px,${(y * d).toFixed(1)}px,0)`;
      });
    };
    const onLeave = () => chips.forEach((c) => (c.style.transform = ""));
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div ref={rootRef} className={cx(s.root, fontClassName)}>
      <div className={s.field} aria-hidden="true">
        <Image {...designImage("blue-gown")} alt="" sizes="60vw" className={s.field__photo} />
        <div className={cx(s.blob, s.b1)} />
        <div className={cx(s.blob, s.b2)} />
        <div className={cx(s.blob, s.b3)} />
        <div className={cx(s.blob, s.b4)} />
        <div className={cx(s.blob, s.b5)} />
        <div className={s.grain} />
      </div>

      <a className={s.skip} href="#main">Skip to content</a>

      <div className={s["nav-shell"]}>
        <nav className={cx(s.nav, s.glass)} aria-label="Primary">
          <a className={s.brand} href="#top">Chaithrika<em>.</em></a>
          <ul className={s.nav__links}>
            {NAV_LINKS.map(([href, label]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a className={cx(s.btn, s["btn--dark"], s.nav__book)} href="#contact">Book Chaithrika</a>
          <button
            ref={toggleRef}
            className={s.nav__toggle}
            type="button"
            aria-expanded={navOpen}
            aria-controls="navPanel"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span />
          </button>
        </nav>
        <div className={cx(s.nav__panel, s.glass)} id="navPanel" hidden={!navOpen}>
          <ul>
            {NAV_LINKS.map(([href, label]) => (
              <li key={label}><a href={href} onClick={closeNav}>{label}</a></li>
            ))}
            <li><a href="#contact" onClick={closeNav}>Book Chaithrika</a></li>
          </ul>
        </div>
      </div>

      <main id="main">
        <header className={s.hero} id="top" ref={heroRef}>
          <div className={cx(s.wrap, s.hero__grid)}>
            <div>
              <span className={s.eyebrow}>Child model &amp; actress · India</span>
              <h1>Charming <em>Chaithrika</em></h1>
              <p className={s.hero__lede}>
                Runway poise, editorial calm and an actor&rsquo;s instinct for story &mdash; from India Kids Fashion Week to Amazon Kids Dress.
              </p>
              <div className={s.hero__cta}>
                <a className={cx(s.btn, s["btn--dark"])} href="#contact">Start a booking <Arrow /></a>
                <a className={cx(s.btn, s["btn--glass"])} href="#gallery">View portfolio</a>
              </div>
              <div className={s.hero__meta}>
                <div><b>IKFW Season 11</b>Runway, 2024</div>
                <div><b>Amazon Kids Dress</b>Commercial</div>
                <div><b>Pinnacle Business Park</b>Brand shoot</div>
              </div>
            </div>

            <div className={s.stage} id="stage" ref={stageRef}>
              <div className={cx(s.frame, s.glass)}>
                <Image
                  {...designImage("blue-gown")}
                  alt="Chaithrika in a teal-blue rose ball gown, one hand on her hip, seated beside a wooden stool against a pink studio backdrop"
                  sizes="(max-width: 480px) calc(100vw - 72px), (max-width: 900px) 360px, 420px"
                  preload
                />
              </div>
              <div className={cx(s.chip, s["chip--a"], s.glass)} data-depth="12">
                <span className={s.chip__label}>Now booking</span>
                <b>Runway · Editorial · Screen</b>
                <span>Enquiries handled by her parents</span>
              </div>
              <div className={cx(s.chip, s["chip--b"], s.glass)} data-depth="-9">
                <span className={s.chip__label}>Last runway</span>
                <b>IKFW Season 11</b>
                <span>Dec 18, 2024</span>
              </div>
              <div className={cx(s.chip, s["chip--c"], s.glass)} data-depth="6">
                <i className={s.dot} aria-hidden="true" />
                <b>Available for bookings</b>
              </div>
            </div>
          </div>
        </header>

        <section id="about" aria-labelledby="about-h">
          <div className={cx(s.wrap, s.about__grid)}>
            <div className={cx(s.about__head, s.reveal)}>
              <span className={s.eyebrow}>About</span>
              <h2 id="about-h">Presence that <em>reads</em> on camera and on stage.</h2>
            </div>
            <div className={cx(s.about__body, s.glass, s.reveal)}>
              <p>From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence, creativity, and expressive performance to every brief.</p>
              <p>Her work blends clean camera presence with a natural sense of movement and story &mdash; equally at home holding a still frame for a fashion label as she is finding the beat of a scene.</p>
              <ul className={s.disc} aria-label="Disciplines">
                <li><b>Runway</b><span>Show &amp; stage walks</span></li>
                <li><b>Editorial</b><span>Studio &amp; location</span></li>
                <li><b>Commercial</b><span>Brand campaigns</span></li>
                <li><b>Acting</b><span>Screen &amp; performance</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="portfolio" aria-labelledby="cats-h" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={cx(s.cats__head, s.reveal)}>
              <h2 id="cats-h">Two crafts, one quiet confidence.</h2>
              <p>Choose a lens. Each portfolio gathers the looks, locations and moods that best show her range for that kind of brief.</p>
            </div>
            <div className={s.cats__grid}>
              <a className={cx(s.cat, s.reveal)} href="#gallery">
                <Image
                  {...designImage("floral-lehenga")}
                  alt="Chaithrika twirling in a cream floral skirt and maroon embellished top against a pink backdrop"
                  sizes="(max-width: 760px) calc(100vw - 32px), 55vw"
                />
                <div className={cx(s.cat__panel, s.glass)}>
                  <div><h3>Modeling</h3><p>Runway · Editorial · Fashion campaigns</p></div>
                  <span className={s.arrow} aria-hidden="true"><Arrow /></span>
                </div>
              </a>
              <a className={cx(s.cat, s.reveal)} href="#gallery">
                <Image
                  {...designImage("saree")}
                  alt="Chaithrika in an orange and green traditional outfit with jewellery, leaning on a tree and looking upward"
                  sizes="(max-width: 760px) calc(100vw - 32px), 40vw"
                />
                <div className={cx(s.cat__panel, s.glass)}>
                  <div><h3>Acting</h3><p>Screen · Stage · Performance</p></div>
                  <span className={s.arrow} aria-hidden="true"><Arrow /></span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section id="work" aria-labelledby="work-h" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={cx(s.feat__head, s.reveal)}>
              <span className={s.eyebrow}>Featured work</span>
              <h2 id="work-h">Moments from the runway and the set.</h2>
            </div>

            <article className={s.work}>
              <div className={cx(s.work__img, s.reveal)}>
                <Image
                  {...designImage("runway")}
                  alt="Chaithrika walking the IKFW Season 11 runway in a kalamkari crop top and mint striped lehenga under stage lights"
                  sizes="(max-width: 860px) calc(100vw - 32px), min(800px, 64vw)"
                />
              </div>
              <div className={cx(s.work__card, s.glass, s.sheen, s.reveal)}>
                <div className={s.tag}><span className={s.pill}>Runway</span><span className={s.pill}>Dec 18, 2024</span></div>
                <h3>India Kids Fashion Week, Season 11</h3>
                <p>A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable runway finish.</p>
                <dl><dt>Format</dt><dd>Runway show</dd><dt>Look</dt><dd>Kalamkari crop top, mint striped lehenga</dd></dl>
              </div>
            </article>

            <article className={cx(s.work, s["work--flip"])}>
              <div className={cx(s.work__img, s.reveal)}>
                <Image
                  {...designImage("red-peplum")}
                  alt="Chaithrika smiling in a red brocade peplum top and pink skirt against a pink studio backdrop"
                  sizes="(max-width: 860px) calc(100vw - 32px), min(800px, 64vw)"
                  className={s.pos25}
                />
              </div>
              <div className={cx(s.work__card, s.glass, s.sheen, s.reveal)}>
                <div className={s.tag}><span className={s.pill}>Brand campaign</span><span className={s.pill}>2024</span></div>
                <h3>Pinnacle Business Park &mdash; Brand Photoshoot</h3>
                <p>A brand campaign shot at one of Bangalore&rsquo;s premier business destinations, balancing couture, confidence, and polished camera presence.</p>
                <dl><dt>Format</dt><dd>Brand photoshoot</dd><dt>City</dt><dd>Bangalore</dd></dl>
              </div>
            </article>
          </div>
        </section>

        <section id="gallery" aria-labelledby="gal-h" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={cx(s.gal__head, s.reveal)}>
              <div>
                <span className={s.eyebrow}>Gallery</span>
                <h2 id="gal-h">Range, in <em>every</em> light.</h2>
              </div>
              <p>Studio colour, festival tradition and easy everyday play &mdash; a selection across looks and moods.</p>
            </div>
            <div className={s.gallery}>
              {GALLERY.map((g) => (
                <figure key={g.name} className={cx(s.glass, s.reveal)}>
                  <Image
                    {...designImage(g.name)}
                    alt={g.alt}
                    sizes={GALLERY_SIZES}
                    className={cx(s[g.ratio], "pos" in g && s[g.pos])}
                  />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={s.quote} aria-label="In her words" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <figure className={cx(s.quote__card, s.glass, s.reveal)}>
              <div className={s.quote__img}>
                <Image {...designImage("white-chair")} alt="" sizes="(max-width: 750px) 120px, 220px" />
              </div>
              <blockquote>
                <p>&ldquo;Modeling and acting both ask for <em>presence.</em> I love the challenge each one brings.&rdquo;</p>
                <footer>Chaithrika</footer>
              </blockquote>
            </figure>
          </div>
        </section>

        <section id="contact" aria-labelledby="book-h" style={{ paddingTop: 0 }}>
          <div className={cx(s.wrap, s.book__grid)}>
            <div className={cx(s.book__intro, s.reveal)}>
              <span className={s.eyebrow}>Bookings</span>
              <h2 id="book-h">Let&rsquo;s create something <em>beautiful</em> together.</h2>
              <p>Share a little about your project and her parents will come back to you with availability and next steps.</p>
              <ul className={s.book__list}>
                <li>Kids fashion campaigns &amp; lookbooks</li>
                <li>Runway shows &amp; live events</li>
                <li>Film, series &amp; commercial casting</li>
              </ul>
            </div>
            <form className={cx(s.form, s.glass, s.reveal)} id="bookForm" noValidate onSubmit={onSubmit}>
              <div className={s["field-row"]}>
                <label htmlFor="f-name">Your name</label>
                <input id="f-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className={s["field-row"]}>
                <label htmlFor="f-company">Brand / company</label>
                <input id="f-company" name="company" type="text" autoComplete="organization" />
              </div>
              <div className={cx(s["field-row"], s["field-row--full"])}>
                <label htmlFor="f-type">Project type</label>
                <select id="f-type" name="type">
                  <option>Fashion campaign / lookbook</option>
                  <option>Runway show</option>
                  <option>Editorial shoot</option>
                  <option>Film / screen acting</option>
                  <option>Commercial / advertising</option>
                  <option>Event appearance</option>
                </select>
              </div>
              <div className={cx(s["field-row"], s["field-row--full"])}>
                <label htmlFor="f-msg">Tell us about the brief</label>
                <textarea id="f-msg" name="message" placeholder="Dates, location, the look you have in mind" />
              </div>
              <div className={s.form__foot}>
                <p className={s.form__note}>Available for bookings. Replies come from her parents.</p>
                <button className={cx(s.btn, s["btn--dark"])} type="submit">Send enquiry <Arrow /></button>
              </div>
              <p className={s.form__msg} id="formMsg" role="status" hidden={!sent}>
                {sent ? "Thank you — this is a design preview, so nothing was sent." : ""}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className={s.site}>
        <div className={s.wrap}>
          <div className={cx(s.foot, s.glass)}>
            <div className={s.foot__mark}>Charming<br /><em>Chaithrika</em></div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="#portfolio">Modeling</a></li>
                <li><a href="#portfolio">Acting</a></li>
                <li><a href="#work">Work</a></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul>
                <li><a href="#contact">Book</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </div>
          </div>
          <div className={s.foot__base}>
            <span>&copy; 2026 Charming Chaithrika</span>
            <span className={s.foot__baseRight}>
              <span>Design option 04 of 10 &mdash; Modern Glassmorphism</span>
              <Link href="/designs">View all designs</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
