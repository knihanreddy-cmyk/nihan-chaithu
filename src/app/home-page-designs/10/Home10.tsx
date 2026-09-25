"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { designImage, usePageBackground, type DesignImageName } from "@/components/designs/shared";
import styles from "./home.module.css";

/** Join CSS-module class names, keeping the template's original (hyphenated) names. */
const c = (...names: string[]) => names.map((n) => styles[n]).join(" ");

/** Inline CSS custom properties (the template's per-polaroid layout variables). */
const vars = (v: Record<`--${string}`, string>) => v as CSSProperties;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Who = "c" | "n";

const HEROES: Record<Who, { href: string; name: string }> = {
  c: { href: "/chaithrika", name: "Chaithrika" },
  n: { href: "/nihan", name: "Nihan" },
};

type Frame = { left: string; top: string; width: string; height: string; padding: string; transform: string };
type Measure = { cx: number; cy: number; w: number; h: number; p: number; pb: number; a: number; cap: number };

/* ---------- choose: fly to centre, photo fills screen (geometry straight from the template) ---------- */
function angleOf(node: Element) {
  const t = getComputedStyle(node).transform;
  if (!t || t === "none") return { a: 0, s: 1 };
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return { a: 0, s: 1 };
  const [a, b] = m[1].split(",").map(parseFloat);
  return { a: (Math.atan2(b, a) * 180) / Math.PI, s: Math.hypot(a, b) };
}

function measure(el: HTMLElement): Measure | null {
  const card = el.querySelector<HTMLElement>("[data-part='card']");
  const photo = el.querySelector<HTMLElement>("[data-part='photo']");
  const capEl = el.querySelector<HTMLElement>("[data-part='cap']");
  if (!card || !photo || !capEl) return null;
  const r = card.getBoundingClientRect();
  const { a, s } = angleOf(card);
  const w = card.offsetWidth * s;
  const h = card.offsetHeight * s;
  const p = photo.offsetLeft * s;
  const pb = h - p - photo.offsetHeight * s;
  const cap = parseFloat(getComputedStyle(capEl).fontSize) * s;
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w, h, p, pb, a, cap };
}

function buildFrames(m: Measure): [Frame, Frame, Frame] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const f = Math.min(1.25, (vh * 0.7) / m.h, (vw * 0.8) / m.w);
  const k = Math.max(1, f);
  const box = (cx: number, cy: number, w: number, h: number, p: number, pb: number, rot: number): Frame => ({
    left: `${cx}px`,
    top: `${cy}px`,
    width: `${w}px`,
    height: `${h}px`,
    padding: `${p}px ${p}px ${pb}px ${p}px`,
    transform: `translate(-50%, -50%) rotate(${rot}deg)`,
  });
  const k0 = box(m.cx, m.cy, m.w, m.h, m.p, m.pb, m.a);
  const k1 = box(vw / 2, vh / 2, m.w * k, m.h * k, m.p * k, m.pb * k, 0);
  const P = Math.round(Math.max(vw, vh) * 0.07);
  const PB = Math.round(P * 3.4);
  const k2 = box(vw / 2, (vh + PB - P) / 2, vw + 2 * P, vh + P + PB, P, PB, 0);
  return [k0, k1, k2];
}

type Session = {
  busy: boolean;
  fly: HTMLDivElement | null;
  flying: HTMLElement | null;
  timers: Set<number>;
};

export default function Home10({ fontClassName }: { fontClassName: string }) {
  usePageBackground("#E8DCCB");
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const flyLayerRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<Session>({ busy: false, fly: null, flying: null, timers: new Set() });

  /* Tear the transition down (bfcache restore via pageshow.persisted, and unmount). */
  useEffect(() => {
    const s = sessionRef.current;
    const root = rootRef.current;
    const teardown = () => {
      s.timers.forEach((id) => window.clearTimeout(id));
      s.timers.clear();
      if (s.fly) {
        s.fly.getAnimations().forEach((a) => a.cancel());
        s.fly.remove();
        s.fly = null;
      }
      s.flying?.classList.remove(styles["is-flying"]);
      s.flying = null;
      root?.classList.remove(styles["is-choosing"]);
      s.busy = false;
    };
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) teardown();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      teardown();
    };
  }, []);

  /* ---------- drag: move threshold before drag, click without drag = choose, pan-y still scrolls ---------- */
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const s = sessionRef.current;
    const polas = Array.from(table.querySelectorAll<HTMLElement>("[data-pola]"));
    const suppressTimers = new Set<number>();
    const offs: (() => void)[] = [];
    let zTop = 20;

    polas.forEach((el) => {
      let st: {
        id: number;
        x0: number;
        y0: number;
        lastX: number;
        dx0: number;
        dy0: number;
        rect: DOMRect;
        drag: boolean;
        tilt: number;
        slop: number;
        dx: number;
        dy: number;
      } | null = null;
      el.dataset.dx = "0";
      el.dataset.dy = "0";

      const onDown = (e: PointerEvent) => {
        if (e.button !== 0 || s.busy) return;
        st = {
          id: e.pointerId,
          x0: e.clientX,
          y0: e.clientY,
          lastX: e.clientX,
          dx0: parseFloat(el.dataset.dx ?? "0"),
          dy0: parseFloat(el.dataset.dy ?? "0"),
          rect: el.getBoundingClientRect(),
          drag: false,
          tilt: 0,
          slop: e.pointerType === "mouse" ? 5 : 9,
          dx: 0,
          dy: 0,
        };
      };

      const onMove = (e: PointerEvent) => {
        if (!st || e.pointerId !== st.id) return;
        let mx = e.clientX - st.x0;
        let my = e.clientY - st.y0;
        if (!st.drag) {
          if (Math.hypot(mx, my) < st.slop) return;
          st.drag = true;
          el.classList.add(styles["is-dragging"]);
          el.style.zIndex = String(++zTop);
          try {
            el.setPointerCapture(st.id);
          } catch {
            /* pointer already gone */
          }
        }
        e.preventDefault();
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;
        const r = st.rect;
        const m = 6;
        mx = clamp(mx, Math.min(0, m - r.left), Math.max(0, vw - m - r.right));
        my = clamp(my, Math.min(0, m - r.top), Math.max(0, vh - m - r.bottom));
        const vx = e.clientX - st.lastX;
        st.lastX = e.clientX;
        st.tilt = st.tilt * 0.75 + clamp(vx * 0.9, -14, 14) * 0.25;
        st.dx = st.dx0 + mx;
        st.dy = st.dy0 + my;
        el.style.setProperty("--dx", `${st.dx}px`);
        el.style.setProperty("--dy", `${st.dy}px`);
        el.style.setProperty("--drot", `${st.tilt.toFixed(2)}deg`);
      };

      const onEnd = (e: PointerEvent) => {
        if (!st || e.pointerId !== st.id) return;
        if (st.drag) {
          el.classList.remove(styles["is-dragging"]);
          el.dataset.dx = String(st.dx);
          el.dataset.dy = String(st.dy);
          /* settle with a new, slightly different resting angle */
          const base = parseFloat(getComputedStyle(el).getPropertyValue("--rot")) || 0;
          el.style.setProperty("--rot", `${clamp(base + st.tilt * 0.5, -16, 16).toFixed(1)}deg`);
          el.style.setProperty("--drot", "0deg");
          el.dataset.suppress = "1";
          const id = window.setTimeout(() => {
            suppressTimers.delete(id);
            delete el.dataset.suppress;
          }, 60);
          suppressTimers.add(id);
        }
        st = null;
      };

      const onDragStart = (e: DragEvent) => e.preventDefault();

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onEnd);
      el.addEventListener("pointercancel", onEnd);
      el.addEventListener("dragstart", onDragStart);
      offs.push(() => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onEnd);
        el.removeEventListener("pointercancel", onEnd);
        el.removeEventListener("dragstart", onDragStart);
      });
    });

    return () => {
      offs.forEach((off) => off());
      suppressTimers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const choose = async (el: HTMLElement, who: Who) => {
    const s = sessionRef.current;
    s.busy = true;
    const hero = HEROES[who];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          s.timers.delete(id);
          resolve();
        }, ms);
        s.timers.add(id);
      });

    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      router.push(hero.href);
    };
    // Safety net: navigate even if an animation never reports finishing.
    void wait(reduce ? 900 : 480 + 90 + 760 + 700).then(go);

    const root = rootRef.current;
    const layer = flyLayerRef.current;
    const m = measure(el);
    const srcPhoto = el.querySelector<HTMLElement>("[data-part='photo']");
    if (!root || !layer || !m || !srcPhoto) return go();
    const frames = buildFrames(m);

    const fly = document.createElement("div");
    fly.className = styles.fly;
    fly.setAttribute("aria-hidden", "true");
    const win = document.createElement("div");
    win.className = styles["fly__win"];
    const photo = srcPhoto.cloneNode(true) as HTMLElement;
    photo.querySelectorAll("[data-swap]").forEach((n) => n.removeAttribute("data-swap"));
    // The clone grows to fill the viewport: let the browser pick a sharper srcset candidate.
    photo.querySelectorAll("img").forEach((img) => {
      img.sizes = "100vw";
    });
    const cap = document.createElement("div");
    cap.className = styles["fly__cap"];
    cap.textContent = hero.name;
    cap.style.fontSize = `${m.cap}px`;
    cap.style.height = `${m.pb}px`;
    win.append(photo, cap);
    fly.append(win);
    Object.assign(fly.style, reduce ? frames[2] : frames[0]);
    layer.appendChild(fly);
    s.fly = fly;
    s.flying = el;

    el.classList.add(styles["is-flying"]);
    root.classList.add(styles["is-choosing"]);

    try {
      if (reduce) {
        await fly.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "both" }).finished;
      } else {
        await fly.animate([frames[0], frames[1]], {
          duration: 480,
          easing: "cubic-bezier(.3,.7,.2,1)",
          fill: "forwards",
        }).finished;
        await wait(90);
        await fly.animate([frames[1], frames[2]], {
          duration: 760,
          easing: "cubic-bezier(.7,0,.2,1)",
          fill: "forwards",
        }).finished;
      }
    } catch {
      return; // cancelled by a teardown
    }
    go();
  };

  const onHeroClick = (e: MouseEvent<HTMLAnchorElement>, who: Who) => {
    const el = e.currentTarget;
    // A drag just ended on this polaroid: swallow the click it produces.
    if (el.dataset.suppress) {
      e.preventDefault();
      delete el.dataset.suppress;
      return;
    }
    // Let ctrl/cmd/shift/middle clicks open the link normally.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (sessionRef.current.busy) return;
    void choose(el, who);
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${styles.page} ${fontClassName}`}>
      <header className={c("wrap", "top", "fade")}>
        <Link className={styles.wordmark} href="/" aria-label="Chaithrika and Nihan, home">
          <span className={styles["wordmark__mono"]} aria-hidden="true">
            C<i>&amp;</i>N
          </span>
          <span className={styles["wordmark__full"]}>Chaithrika &amp; Nihan</span>
        </Link>
        <span className={styles["top__meta"]}>The family album</span>
      </header>

      <main className={styles.wrap}>
        <div className={c("intro", "fade")}>
          <h1>Which story would you like to open?</h1>
          <p>pick up a polaroid, or push them around the table</p>
        </div>

        <div className={styles.table} ref={tableRef}>
          {/* decorative polaroids */}
          <DecorPola
            image="fairy"
            caption="wings"
            style={vars({
              "--x": "17%",
              "--y": "36%",
              "--mx": "19%",
              "--my": "17%",
              "--rot": "-13deg",
              "--i": "0",
              "--fr": "-50deg",
              "--fx": "-30vw",
            })}
          />
          <DecorPola
            image="teal-lehenga"
            caption="festive"
            hideSmall
            style={vars({ "--x": "50%", "--y": "74%", "--rot": "7deg", "--i": "1", "--fr": "40deg", "--fx": "10vw" })}
          />
          <DecorPola
            image="garden"
            caption="garden"
            style={vars({
              "--x": "83%",
              "--y": "38%",
              "--mx": "81%",
              "--my": "19%",
              "--rot": "12deg",
              "--i": "2",
              "--fr": "55deg",
              "--fx": "30vw",
            })}
          />

          <p className={styles.ptag} style={vars({ "--x": "12%", "--y": "82%" })}>
            <b>Note</b>tap a photo to open,
            <br /> drag to rearrange
          </p>

          {/* hero: Chaithrika */}
          <Link
            className={c("pola", "pola--hero", "pola--c")}
            href="/chaithrika"
            draggable={false}
            data-pola=""
            aria-label="Chaithrika — open her portfolio"
            onClick={(e) => onHeroClick(e, "c")}
            style={vars({
              "--x": "38%",
              "--y": "50%",
              "--mx": "26%",
              "--my": "56%",
              "--rot": "-5deg",
              "--i": "3",
              "--fr": "-38deg",
              "--fx": "-20vw",
            })}
          >
            <div className={styles["pola__toss"]}>
              <div className={styles["pola__card"]} data-part="card">
                <div className={styles["pola__photo"]} data-part="photo">
                  <Image
                    {...designImage("red-peplum")}
                    alt="Chaithrika smiling in a red brocade peplum"
                    sizes="(max-width: 720px) 44vw, 280px"
                    draggable={false}
                    preload
                  />
                </div>
                <p className={styles["pola__cap"]} data-part="cap">
                  Chaithrika<small>open her story</small>
                </p>
              </div>
            </div>
          </Link>

          {/* hero: Nihan */}
          <Link
            className={c("pola", "pola--hero", "pola--n")}
            href="/nihan"
            draggable={false}
            data-pola=""
            aria-label="Nihan — open his portfolio"
            onClick={(e) => onHeroClick(e, "n")}
            style={vars({
              "--x": "62%",
              "--y": "49%",
              "--mx": "74%",
              "--my": "55%",
              "--rot": "4deg",
              "--i": "4",
              "--fr": "34deg",
              "--fx": "20vw",
            })}
          >
            <div className={styles["pola__toss"]}>
              <div className={styles["pola__card"]} data-part="card">
                <div className={styles["pola__photo"]} data-part="photo">
                  {/* Replace with <Image {...designImage("nihan")} alt="Nihan" sizes="(max-width: 720px) 44vw, 280px" draggable={false} /> when Nihan's photos are ready */}
                  <div
                    className={styles["portrait--placeholder"]}
                    data-swap="nihan"
                    role="img"
                    aria-label="Nihan — photo coming soon"
                  >
                    <span className={styles["ph__n"]} aria-hidden="true">
                      N
                    </span>
                    <span className={styles["ph__note"]} aria-hidden="true">
                      photo coming soon
                    </span>
                  </div>
                </div>
                <p className={styles["pola__cap"]} data-part="cap">
                  Nihan<small>open his story</small>
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className={c("wrap", "fade", "late")}>
        <div className={styles.foot}>
          <span>Bookings managed by their parents</span>
          <span className={styles["foot-meta"]}>
            <span>
              Home option <b>10</b> of 10 — <b>Polaroid Table</b>
            </span>
            <Link className={styles["foot-link"]} href="/home-page-designs">
              All home designs
            </Link>
          </span>
        </div>
      </footer>

      {/* The flying polaroid clone is mounted here while a choice transitions to its page. */}
      <div ref={flyLayerRef} />
    </div>
  );
}

function DecorPola({
  image,
  caption,
  hideSmall = false,
  style,
}: {
  image: DesignImageName;
  caption: string;
  hideSmall?: boolean;
  style: CSSProperties;
}) {
  return (
    <div
      className={hideSmall ? c("pola", "pola--decor", "pola--hide-sm") : c("pola", "pola--decor")}
      data-pola=""
      aria-hidden="true"
      style={style}
    >
      <div className={styles["pola__toss"]}>
        <div className={styles["pola__card"]}>
          <div className={styles["pola__photo"]}>
            <Image {...designImage(image)} alt="" sizes="(max-width: 720px) 30vw, 200px" draggable={false} />
          </div>
          <p className={styles["pola__cap"]}>{caption}</p>
        </div>
      </div>
    </div>
  );
}
