"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { designImage, usePageBackground, type DesignImageName } from "@/components/designs/shared";
import s from "./design.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

const Arrow = ({ width = "1.8" }: { width?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={width} aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const NAV_LINKS: [string, string][] = [
  ["#portfolio", "Modeling"],
  ["#portfolio", "Acting"],
  ["#work", "Work"],
  ["#about", "About"],
];

type Cat = "studio" | "runway" | "outdoor";
type Filter = "all" | Cat;

const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["studio", "Studio"],
  ["runway", "Runway"],
  ["outdoor", "Outdoor"],
];

const GALLERY: { name: DesignImageName; cat: Cat; alt: string; title: string; pos?: "pos30" | "pos40" }[] = [
  { name: "floral-lehenga", cat: "studio", alt: "Chaithrika twirling in a cream floral skirt and maroon embellished top, pink backdrop", title: "Floral twirl" },
  { name: "runway", cat: "runway", alt: "Chaithrika walking the IKFW runway under stage lights", title: "IKFW S11", pos: "pos30" },
  { name: "garden", cat: "outdoor", alt: "Chaithrika in a black and gold half-saree, smiling shyly in a flowering garden", title: "Garden light" },
  { name: "teal-lehenga", cat: "studio", alt: "Chaithrika in a green blouse, orange silk lehenga and teal dupatta, looking off frame", title: "Silk & teal" },
  { name: "backstage", cat: "runway", alt: "Chaithrika backstage at IKFW, looking into a bulb-lit makeup mirror with an event lanyard", title: "Backstage", pos: "pos40" },
  { name: "green-gown", cat: "outdoor", alt: "Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind", title: "Emerald gown" },
  { name: "fairy", cat: "studio", alt: "Chaithrika in a white tulle dress with fairy wings, grey backdrop", title: "Fairy wings" },
  { name: "park", cat: "outdoor", alt: "Chaithrika in a yellow tee with an owl backpack on a red park bench, low angle", title: "Park day" },
  { name: "white-chair", cat: "studio", alt: "Chaithrika in a white tulle dress seated on a white folding chair, soft pink hearts behind", title: "Soft white" },
];

const CAT_LABEL: Record<Cat, string> = { studio: "Studio", runway: "Runway", outdoor: "Outdoor" };
const pad = (n: number) => (n < 10 ? "0" : "") + n;
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Design9({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#06070B");

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const galRef = useRef<HTMLDivElement>(null);
  const countRafRef = useRef(0);
  const currentCountRef = useRef(GALLERY.length);

  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [count, setCount] = useState(GALLERY.length);
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
      if (window.innerWidth > 920) setNavOpen(false);
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
    const items = root.querySelectorAll<HTMLElement>(`.${CSS.escape(s.reveal)}`);
    if (prefersReduced() || !("IntersectionObserver" in window)) {
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

  // Cursor spotlight (hero + stage), rAF-throttled.
  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;
    if (prefersReduced() || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let ev: PointerEvent | null = null;
    const onMove = (e: PointerEvent) => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!ev) return;
        const h = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${ev.clientX - h.left}px`);
        hero.style.setProperty("--my", `${ev.clientY - h.top}px`);
        const r = stage.getBoundingClientRect();
        stage.style.setProperty("--sx", `${ev.clientX - r.left}px`);
        stage.style.setProperty("--sy", `${ev.clientY - r.top}px`);
      });
    };
    hero.addEventListener("pointermove", onMove);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 3D tilt (max 6deg) on every .tilt element.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReduced() || !window.matchMedia("(pointer: fine)").matches) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(`.${CSS.escape(s.tilt)}`));
    const cleanups = els.map((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add(s["is-tilting"]);
        el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
      };
      const onLeave = () => {
        el.classList.remove(s["is-tilting"]);
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        onLeave();
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Segmented-control indicator: position under the pressed button.
  const moveInd = useCallback((btn: HTMLElement, animate = true) => {
    const ind = indRef.current;
    if (!ind) return;
    if (!animate) ind.style.transition = "none";
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.transform = `translateX(${btn.offsetLeft}px)`;
    if (!animate) {
      void ind.offsetWidth;
      ind.style.transition = "";
    }
  }, []);

  useEffect(() => {
    let alive = true;
    const sync = (animate: boolean) => {
      const active = segRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (active) moveInd(active, animate);
    };
    sync(false);
    const onResize = () => sync(true);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => {
      if (alive) sync(false);
    });
    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
    };
  }, [moveInd]);

  useEffect(() => () => cancelAnimationFrame(countRafRef.current), []);

  const animateCount = (to: number) => {
    const from = currentCountRef.current;
    currentCountRef.current = to;
    cancelAnimationFrame(countRafRef.current);
    if (prefersReduced() || from === to) {
      setCount(to);
      return;
    }
    let start: number | null = null;
    const dur = 420;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(from + (to - from) * e));
      if (p < 1) countRafRef.current = requestAnimationFrame(step);
    };
    countRafRef.current = requestAnimationFrame(step);
  };

  const applyFilter = (f: Filter, btn: HTMLButtonElement) => {
    moveInd(btn);
    // Commit the new hidden/aria-pressed state synchronously so the pop
    // animation can be restarted on exactly the figures that stay visible.
    flushSync(() => setFilter(f));
    let n = 0;
    galRef.current?.querySelectorAll<HTMLElement>("figure").forEach((fig) => {
      fig.classList.remove(s.show);
      if (!fig.hidden) {
        n++;
        void fig.offsetWidth;
        fig.classList.add(s.show);
      }
    });
    animateCount(n);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  const cutout = designImage("runway-cutout");
  const cutoutSizes = "(max-width: 920px) min(274px, 57vw), 310px";

  return (
    <div ref={rootRef} className={cx(s.root, fontClassName)}>
      <a className={s.skip} href="#main">Skip to content</a>

      <nav className={s.nav} aria-label="Primary">
        <div className={cx(s.wrap, s.nav__in)}>
          <a className={s.brand} href="#top"><b>CHAITHRIKA</b><span>MODEL / ACTOR</span></a>
          <ul className={s.nav__links}>
            {NAV_LINKS.map(([href, label]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a className={cx(s.btn, s["btn--prime"], s.nav__book)} href="#contact">Book</a>
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
        </div>
        <div className={s.nav__panel} id="navPanel" hidden={!navOpen}>
          <ul className={s.wrap}>
            {NAV_LINKS.map(([href, label]) => (
              <li key={label}><a href={href} onClick={closeNav}>{label}</a></li>
            ))}
            <li><a href="#contact" onClick={closeNav}>Book Chaithrika</a></li>
          </ul>
        </div>
      </nav>

      <main id="main">
        <header className={s.hero} id="top" ref={heroRef}>
          <div className={cx(s.wrap, s.hero__grid)}>
            <div>
              <ul className={s.status} aria-label="Current status">
                <li><i className={s.led} aria-hidden="true" />Status: <b>Available for bookings</b></li>
                <li>Last runway: <b>IKFW S11 &mdash; 18.12.2024</b></li>
              </ul>
              <h1>Presence, engineered <span className={s["grad-text"]}>for the frame.</span></h1>
              <p className={s.hero__lede}>
                <b>Charming Chaithrika</b> is a child model and actress from India &mdash; runway-trained at India Kids Fashion Week, camera-ready for brands like Amazon Kids Dress, and instinctive in front of a story.
              </p>
              <div className={s.hero__cta}>
                <a className={cx(s.btn, s["btn--prime"])} href="#contact">Start a booking <Arrow /></a>
                <a className={cx(s.btn, s["btn--ghost"])} href="#gallery">Explore the portfolio</a>
              </div>
              <dl className={s.spec}>
                <div><dt>Runway</dt><dd>IKFW S11</dd></div>
                <div><dt>Commercial</dt><dd>Amazon</dd></div>
                <div><dt>Brand</dt><dd>Pinnacle</dd></div>
                <div><dt>Base</dt><dd>India</dd></div>
              </dl>
            </div>

            <div className={s.stage} id="stage" ref={stageRef}>
              <div className={s.stage__mesh} aria-hidden="true" />
              <div className={s.stage__grid} aria-hidden="true" />
              <div className={s.stage__floor} aria-hidden="true" />
              <div className={s.stage__ring} aria-hidden="true" />
              <div className={s.figure}>
                <Image
                  {...cutout}
                  alt="Chaithrika in her IKFW Season 11 runway look: a kalamkari crop top and mint striped lehenga"
                  sizes={cutoutSizes}
                  preload
                />
                <Image {...cutout} alt="" aria-hidden="true" sizes={cutoutSizes} className={s.reflect} />
              </div>
              <div className={s.stage__spot} aria-hidden="true" />
              <span className={cx(s.corner, s.c1)} aria-hidden="true" />
              <span className={cx(s.corner, s.c2)} aria-hidden="true" />
              <div className={cx(s.hud, s["hud--tl"])} aria-hidden="true"><b>Look 01</b>IKFW &middot; Season 11</div>
              <div className={cx(s.hud, s["hud--tr"])} aria-hidden="true"><b>Runway</b>18.12.2024</div>
              <div className={cx(s.hud, s["hud--bl"])} aria-hidden="true"><b>Kalamkari</b>Mint lehenga</div>
              <div className={cx(s.hud, s["hud--br"])} aria-hidden="true"><b>Live</b>Booking open</div>
            </div>
          </div>
        </header>

        <hr className={s.hairline} />

        <section className={s.about} id="about" aria-labelledby="about-h">
          <div className={cx(s.wrap, s.about__grid)}>
            <div className={s.reveal}>
              <span className={s.label}>Profile</span>
              <h2 id="about-h">Calm on the runway. Alive in the scene.</h2>
            </div>
            <div className={s.reveal}>
              <p className={s.about__bio}>From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence, creativity, and expressive performance to every brief.</p>
              <p>Her work blends clean camera presence with a natural sense of movement and story &mdash; the steadiness a fashion label needs, with the openness a director can shape.</p>
              <ul className={s.disc} aria-label="Disciplines">
                <li><b>Runway</b><span>Shows &middot; Live stage</span></li>
                <li><b>Editorial</b><span>Studio &middot; Location</span></li>
                <li><b>Commercial</b><span>Brand &middot; E-commerce</span></li>
                <li><b>Acting</b><span>Screen &middot; Performance</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="portfolio" aria-labelledby="cats-h" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={cx(s.head, s.reveal)}>
              <div><span className={s.label}>Portfolios</span><h2 id="cats-h">Two modes. One performer.</h2></div>
              <p>Browse by the kind of brief you are casting &mdash; each portfolio is curated for how that work is judged.</p>
            </div>
            <div className={s.cats}>
              <a className={cx(s.cat, s.gb, s.tilt, s.reveal)} href="#gallery">
                <div className={s.cat__img}>
                  <Image
                    {...designImage("orange-flowers")}
                    alt="Chaithrika in an orange dress with 3D flowers, hands on hips, against a grey studio backdrop"
                    sizes="(max-width: 760px) calc(100vw - 54px), min(620px, 46vw)"
                  />
                </div>
                <div className={s.cat__body}>
                  <div><h3>Modeling</h3><p>Runway &middot; Editorial &middot; Fashion campaigns</p></div>
                  <span className={s.go} aria-hidden="true"><Arrow width="1.6" /></span>
                </div>
              </a>
              <a className={cx(s.cat, s.gb, s.tilt, s.reveal)} href="#gallery">
                <div className={s.cat__img}>
                  <Image
                    {...designImage("navy-ethnic")}
                    alt="Chaithrika in a navy embroidered dress with jewelled hair clips, looking down thoughtfully at hibiscus buds"
                    sizes="(max-width: 760px) calc(100vw - 54px), min(620px, 46vw)"
                    className={s.pos30}
                  />
                </div>
                <div className={s.cat__body}>
                  <div><h3>Acting</h3><p>Screen &middot; Stage &middot; Performance</p></div>
                  <span className={s.go} aria-hidden="true"><Arrow width="1.6" /></span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section id="work" aria-labelledby="work-h" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={cx(s.head, s.reveal)}>
              <div><span className={s.label}>Featured work</span><h2 id="work-h">Selected credits.</h2></div>
              <p>Recent moments on the runway and in front of the brand camera.</p>
            </div>
            <div className={s.feat}>
              <article className={cx(s.proj, s["proj--a"], s.gb, s.tilt, s.reveal)}>
                <div className={s.proj__img}>
                  <Image
                    {...designImage("runway")}
                    alt="Chaithrika on the IKFW Season 11 runway in a kalamkari crop top and mint striped lehenga, under stage lights with the audience watching"
                    sizes="(max-width: 860px) calc(100vw - 54px), min(700px, 52vw)"
                  />
                  <span className={s.proj__tag}>Runway show</span>
                </div>
                <div className={s.proj__body}>
                  <div className={s.proj__meta}><span><b>IKFW</b> Season 11</span><span>Dec 18, 2024</span></div>
                  <h3>India Kids Fashion Week</h3>
                  <p>A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable runway finish.</p>
                </div>
              </article>
              <article className={cx(s.proj, s["proj--b"], s.gb, s.tilt, s.reveal)}>
                <div className={s.proj__img}>
                  <Image
                    {...designImage("blue-gown")}
                    alt="Chaithrika in a teal-blue rose ball gown with a hand on her hip beside a wooden stool, pink backdrop"
                    sizes="(max-width: 860px) calc(100vw - 54px), min(560px, 42vw)"
                  />
                  <span className={s.proj__tag}>Brand photoshoot</span>
                </div>
                <div className={s.proj__body}>
                  <div className={s.proj__meta}><span><b>Pinnacle</b> Business Park</span><span>2024</span></div>
                  <h3>Pinnacle Business Park</h3>
                  <p>A brand campaign shot at one of Bangalore&rsquo;s premier business destinations, balancing couture, confidence, and polished camera presence.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="gallery" aria-labelledby="gal-h" style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={cx(s.head, s.reveal)}>
              <div><span className={s.label}>Archive</span><h2 id="gal-h">The frame index.</h2></div>
              <p>Filter by setting to see how her presence carries from seamless studio to live stage to open air.</p>
            </div>
            <div className={cx(s["seg-row"], s.reveal)}>
              <div className={s.seg} role="group" aria-label="Filter gallery" ref={segRef}>
                <span className={s.seg__ind} aria-hidden="true" ref={indRef} />
                {FILTERS.map(([f, label]) => (
                  <button
                    key={f}
                    type="button"
                    data-filter={f}
                    aria-pressed={filter === f}
                    onClick={(e) => applyFilter(f, e.currentTarget)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className={s.count} aria-live="polite">
                Showing <output id="count">{pad(count)}</output> / {pad(GALLERY.length)} frames
              </p>
            </div>
            <div className={s.gal} id="gal" ref={galRef}>
              {GALLERY.map((g) => (
                <figure key={g.name} data-cat={g.cat} className={s.tilt} hidden={filter !== "all" && filter !== g.cat}>
                  <Image
                    {...designImage(g.name)}
                    alt={g.alt}
                    sizes="(max-width: 760px) calc(50vw - 28px), min(420px, 30vw)"
                    className={g.pos ? s[g.pos] : undefined}
                  />
                  <figcaption>{g.title} <span>{CAT_LABEL[g.cat]}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={s.quote} aria-label="In her words" style={{ paddingTop: 0 }}>
          <div className={cx(s.wrap, s.quote__in, s.reveal)}>
            <span className={s.label}>In her words</span>
            <blockquote>
              <p>
                &ldquo;Modeling and acting both ask for <span className={s["grad-text"]}>presence.</span>{" "}
                <span className={s.dim}>I love the challenge each one brings.&rdquo;</span>
              </p>
              <footer className={s.mono}>Chaithrika</footer>
            </blockquote>
          </div>
        </section>

        <section className={s.book} id="contact" aria-labelledby="book-h" style={{ paddingTop: 0 }}>
          <div className={cx(s.wrap, s.book__grid)}>
            <div className={cx(s.book__intro, s.reveal)}>
              <span className={s.label}>Bookings</span>
              <h2 id="book-h">Let&rsquo;s create something beautiful together.</h2>
              <p>Tell us about your brief. Her parents manage every booking and will reply with availability and next steps.</p>
              <ul className={s.book__rows}>
                <li><span>Status</span><span>Available for bookings</span></li>
                <li><span>Disciplines</span><span>Runway &middot; Editorial &middot; Commercial &middot; Acting</span></li>
                <li><span>Managed by</span><span>Parents</span></li>
              </ul>
            </div>
            <form className={cx(s.form, s.gb, s.reveal)} id="bookForm" noValidate onSubmit={onSubmit}>
              <div className={s.form__head}>
                <span className={s.mono}>New enquiry</span>
                <span className={cx(s.mono, s.form__open)}><i className={s.led} aria-hidden="true" />Open</span>
              </div>
              <div className={s.row}>
                <label htmlFor="f-name">Your name</label>
                <input id="f-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className={s.row}>
                <label htmlFor="f-company">Brand / company</label>
                <input id="f-company" name="company" type="text" autoComplete="organization" />
              </div>
              <div className={cx(s.row, s["row--full"])}>
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
              <div className={cx(s.row, s["row--full"])}>
                <label htmlFor="f-msg">Message</label>
                <textarea id="f-msg" name="message" placeholder="Dates, location, and the look or role you have in mind" />
              </div>
              <div className={s.form__foot}>
                <span className={s.mono}>Replies from her parents</span>
                <button className={cx(s.btn, s["btn--prime"])} type="submit">Send enquiry <Arrow /></button>
              </div>
              <p className={s.form__msg} id="formMsg" role="status" hidden={!sent}>
                {sent ? "Thank you — this is a design preview, so nothing was sent." : ""}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <hr className={s.hairline} />
        <div className={s.wrap}>
          <div className={s.foot__top}>
            <div className={s.foot__mark}>Charming<br /><span className={s["grad-text"]}>Chaithrika</span></div>
            <div>
              <h4>Index</h4>
              <ul>
                <li><a href="#portfolio">Modeling</a></li>
                <li><a href="#portfolio">Acting</a></li>
                <li><a href="#work">Work</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul>
                <li><a href="#contact">Book</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className={cx(s.foot__base, s.mono)}>
            <span>&copy; 2026 Charming Chaithrika</span>
            <span className={s.foot__baseRight}>
              <span>Design option 09 of 10 &mdash; Futuristic Premium</span>
              <Link href="/designs">View all designs</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
