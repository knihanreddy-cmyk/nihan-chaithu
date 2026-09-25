"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { designImage, usePageBackground } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: (string | false | null | undefined)[]) =>
  names
    .filter((n): n is string => Boolean(n))
    .map((n) => styles[n])
    .join(" ");

type Who = "c" | "n";

const ISSUES: Record<Who, { href: string; name: string; bg: string; fg: string; accent: string }> = {
  c: { href: "/chaithrika", name: "Chaithrika", bg: "#8E1545", fg: "#F4F0E6", accent: "#B21F5A" },
  n: { href: "/nihan", name: "Nihan", bg: "#E0A21B", fg: "#141414", accent: "#0F3A2C" },
};

const CLIP_VARS = ["--ct", "--cl", "--cr", "--cb"] as const;

export default function Home5({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#E9E7E2");
  const router = useRouter();

  const [chosen, setChosen] = useState<Who | null>(null);
  const [open, setOpen] = useState(false);

  const takeRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const insideRefs = useRef<Record<Who, HTMLDivElement | null>>({ c: null, n: null });
  const busyRef = useRef(false);
  const timersRef = useRef<Set<number>>(new Set());

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const id = window.setTimeout(() => {
        timersRef.current.delete(id);
        resolve();
      }, ms);
      timersRef.current.add(id);
    });

  /* A fresh mount always starts at rest; a bfcache restore (pageshow.persisted) is put back to rest here. */
  useEffect(() => {
    const timers = timersRef.current;
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      const take = takeRef.current;
      if (take) {
        take.hidden = true;
        take.classList.remove(styles["is-pre"]);
        take.style.transition = "";
        CLIP_VARS.forEach((p) => take.style.removeProperty(p));
      }
      setOpen(false);
      setChosen(null);
      busyRef.current = false;
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  const choose = async (who: Who) => {
    busyRef.current = true;
    const issue = ISSUES[who];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      router.push(issue.href);
    };
    // Safety net: navigate even if a step of the transition never completes.
    void wait(reduce ? 900 : 2400).then(go);

    setChosen(who);
    if (!reduce) {
      await wait(260);
      setOpen(true);
      await wait(780);
    }

    const take = takeRef.current;
    const inside = insideRefs.current[who];
    if (!take || !inside) return go();

    take.style.setProperty("--take-bg", issue.bg);
    take.style.setProperty("--take-fg", issue.fg);
    take.style.setProperty("--take-accent", issue.accent);
    if (waterRef.current) waterRef.current.textContent = issue.name;

    const rect = inside.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    take.style.transition = "none";
    if (reduce) {
      take.classList.add(styles["is-pre"]);
      CLIP_VARS.forEach((p) => take.style.setProperty(p, "0px"));
    } else {
      take.style.setProperty("--ct", `${Math.max(0, rect.top)}px`);
      take.style.setProperty("--cl", `${Math.max(0, rect.left)}px`);
      take.style.setProperty("--cr", `${Math.max(0, vw - rect.right)}px`);
      take.style.setProperty("--cb", `${Math.max(0, vh - rect.bottom)}px`);
    }
    take.hidden = false;
    void take.offsetWidth;
    take.style.transition = "";
    if (reduce) take.classList.remove(styles["is-pre"]);
    else CLIP_VARS.forEach((p) => take.style.setProperty(p, "0px"));

    await wait(reduce ? 300 : 620);
    go();
  };

  const onCoverClick = (e: MouseEvent<HTMLAnchorElement>, who: Who) => {
    // Let ctrl/cmd/shift/middle clicks open the link normally.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busyRef.current) return;
    void choose(who);
  };

  const coverState = (who: Who) => [
    chosen === who && "is-chosen",
    chosen === who && open && "is-open",
    chosen !== null && chosen !== who && "is-dismissed",
  ];

  return (
    <div className={`${styles.root} ${c("page", chosen !== null && "is-choosing")} ${fontClassName}`}>
      <header className={c("fade-in", "d1")}>
        <div className={styles["masthead-bar"]}>
          <Link className={styles.wordmark} href="/" aria-label="Chaithrika and Nihan, home">
            <span className={styles["wordmark__mono"]} aria-hidden="true">
              C<span>&amp;</span>N
            </span>
            <span className={styles["wordmark__full"]}>Chaithrika &amp; Nihan</span>
          </Link>
          <p className={styles["bar-meta"]}>The family newsstand</p>
        </div>
        <div className={styles["rule-strip"]} aria-hidden="true">
          <span>Two issues on the stand</span>
          <span>Portfolios of two siblings</span>
          <span>India</span>
        </div>
      </header>

      <main>
        <div className={c("lede", "fade-in", "d1")}>
          <h1>
            Two covers. <em>Pick up an issue.</em>
          </h1>
          <p>Choose a portfolio to open</p>
        </div>

        <div className={styles.stand}>
          {/* CHAITHRIKA */}
          <Link
            className={c("cover", "cover--c", ...coverState("c"))}
            href="/chaithrika"
            aria-label="Chaithrika — open her portfolio"
            onClick={(e) => onCoverClick(e, "c")}
          >
            <div className={styles["cover__drop"]}>
              <div className={styles["cover__tilt"]}>
                <div className={styles["cover__book"]}>
                  <div className={styles["cover__shadow"]} />
                  <div
                    className={styles["cover__inside"]}
                    aria-hidden="true"
                    ref={(node) => {
                      insideRefs.current.c = node;
                    }}
                  >
                    <small>Inside this issue</small>
                    <strong>The world of Chaithrika</strong>
                    <small>Runway · Editorial · Commercial · Acting</small>
                  </div>
                  <div className={styles["cover__leaf"]}>
                    <div className={styles["cover__front"]}>
                      <Image
                        {...designImage("blue-gown")}
                        className={styles.portrait}
                        alt="Chaithrika in a teal ball gown against a pink studio backdrop"
                        sizes="(max-width: 720px) 43vw, 320px"
                        preload
                      />
                      <div className={styles["front-scrim"]} />
                      <div className={styles["issue-line"]} aria-hidden="true">
                        <span>Issue 01</span>
                        <span>Dec 2024</span>
                      </div>
                      <p className={styles.mast} aria-hidden="true">
                        Chaithrika
                      </p>
                      <div className={styles["side-lines"]} aria-hidden="true">
                        <span>
                          <b>Model</b>&amp; Actress
                        </span>
                        <span className={styles.opt}>
                          <b>Amazon</b>Kids Dress
                        </span>
                      </div>
                      <div className={styles.sticker} aria-hidden="true">
                        Open
                        <br />
                        the
                        <br />
                        issue
                      </div>
                      <div className={styles.lines} aria-hidden="true">
                        <span className={c("line", "line--tag")}>IKFW Season 11</span>
                        <span className={c("line", "line--big")}>The Runway Issue</span>
                        <span className={c("line", "line--rule")}>Runway · Editorial · Commercial · Acting</span>
                      </div>
                      <div className={styles.barcode} aria-hidden="true">
                        <span>01 · 2024</span>
                      </div>
                      <div className={styles.spine} />
                      <div className={styles.sheen} />
                    </div>
                    <div className={styles["cover__verso"]} aria-hidden="true">
                      <span>Chaithrika</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tag} aria-hidden="true">
                <em>Chaithrika</em>
                <span>Open issue 01</span>
              </div>
            </div>
          </Link>

          {/* NIHAN */}
          <Link
            className={c("cover", "cover--n", ...coverState("n"))}
            href="/nihan"
            aria-label="Nihan — open his portfolio"
            onClick={(e) => onCoverClick(e, "n")}
          >
            <div className={styles["cover__drop"]}>
              <div className={styles["cover__tilt"]}>
                <div className={styles["cover__book"]}>
                  <div className={styles["cover__shadow"]} />
                  <div
                    className={styles["cover__inside"]}
                    aria-hidden="true"
                    ref={(node) => {
                      insideRefs.current.n = node;
                    }}
                  >
                    <small>Inside this issue</small>
                    <strong>Enter Nihan&rsquo;s world</strong>
                    <small>New faces, fresh frames</small>
                  </div>
                  <div className={styles["cover__leaf"]}>
                    <div className={styles["cover__front"]}>
                      {/* Replace with <Image {...designImage("nihan")} className={styles.portrait} alt="Nihan" sizes="(max-width: 720px) 43vw, 320px" /> when Nihan's photos are ready */}
                      <div
                        className={c("portrait", "portrait--placeholder")}
                        data-swap="nihan"
                        role="img"
                        aria-label="Nihan's portrait — coming soon"
                      >
                        <span className={styles["placeholder__initial"]} aria-hidden="true">
                          N
                        </span>
                        <span className={styles["placeholder__note"]} aria-hidden="true">
                          Portrait coming soon
                        </span>
                      </div>
                      <div className={styles["front-scrim"]} />
                      <div className={styles["issue-line"]} aria-hidden="true">
                        <span>Issue 02</span>
                        <span>The Debut</span>
                      </div>
                      <p className={styles.mast} aria-hidden="true">
                        Nihan
                      </p>
                      <div className={styles["side-lines"]} aria-hidden="true">
                        <span>
                          <b>Portfolio</b>Now opening
                        </span>
                        <span className={styles.opt}>
                          <b>New faces</b>Fresh frames
                        </span>
                      </div>
                      <div className={styles.sticker} aria-hidden="true">
                        First
                        <br />
                        issue
                      </div>
                      <div className={styles.lines} aria-hidden="true">
                        <span className={c("line", "line--tag")}>Portrait coming soon</span>
                        <span className={c("line", "line--big")}>The Debut Issue</span>
                        <span className={c("line", "line--rule")}>Enter Nihan&rsquo;s world</span>
                      </div>
                      <div className={styles.barcode} aria-hidden="true">
                        <span>02 · Debut</span>
                      </div>
                      <div className={styles.spine} />
                      <div className={styles.sheen} />
                    </div>
                    <div className={styles["cover__verso"]} aria-hidden="true">
                      <span>Nihan</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.tag} aria-hidden="true">
                <em>Nihan</em>
                <span>Open issue 02</span>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className={c("foot", "fade-in", "d2")}>
        <span>Bookings managed by their parents</span>
        <span className={styles["foot-meta"]}>
          <span>
            Home option <b>05</b> of 10 — <b>Double Cover</b>
          </span>
          <Link className={styles["foot-link"]} href="/home-page-designs">
            All home designs
          </Link>
        </span>
      </footer>

      {/* The chosen cover's colour grows out of its opened page, then the route changes. */}
      <div className={styles.takeover} ref={takeRef} hidden aria-hidden="true">
        <div className={styles["takeover__water"]} ref={waterRef} />
      </div>
    </div>
  );
}
