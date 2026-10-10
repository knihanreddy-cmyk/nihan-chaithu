"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { birthdayFonts } from "./fonts";
import styles from "./BirthdayCountdown.module.css";

const SEEN_KEY = "cc-birthday-countdown-seen";
const COUNT_FROM = 10;
/** How long the overlay stays after the lights come on, so the confetti can fall. */
const CONFETTI_MS = 4200;
const LEAVE_MS = 700;
const RING_R = 46;
const RING_LEN = 2 * Math.PI * RING_R;

type Phase = "countdown" | "lit" | "leaving" | "done";

/* ------------------------------------------------------------------ */
/* Corner confetti: metallic foil pieces fired from both bottom corners */
/* ------------------------------------------------------------------ */

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  tilt: number;
  vt: number;
  hue: [number, number, number];
  strip: boolean;
};

const FOIL: [number, number, number][] = [
  [232, 232, 232],
  [243, 227, 181],
  [201, 138, 122],
  [255, 255, 255],
  [183, 110, 121],
  [212, 175, 55],
];

function createConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  let pieces: Piece[] = [];
  let raf = 0;
  let last = 0;
  let w = 0;
  let h = 0;

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burst(side: "left" | "right", count: number, power: number) {
    const fromLeft = side === "left";
    const scale = Math.max(0.75, Math.min(1.25, h / 800));
    for (let i = 0; i < count; i++) {
      // Aim up and inward: 50–80° above the horizon, towards the centre.
      const angle = ((50 + Math.random() * 30) * Math.PI) / 180;
      const speed = (11 + Math.random() * 11) * power * scale;
      const strip = Math.random() < 0.28;
      pieces.push({
        x: fromLeft ? -6 : w + 6,
        y: h + 6,
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        w: strip ? 3 + Math.random() * 2 : 7 + Math.random() * 6,
        h: strip ? 14 + Math.random() * 10 : 5 + Math.random() * 6,
        tilt: Math.random() * Math.PI * 2,
        vt: 0.08 + Math.random() * 0.12,
        hue: FOIL[(Math.random() * FOIL.length) | 0],
        strip,
      });
    }
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function frame(now: number) {
    if (!ctx) return;
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    ctx.clearRect(0, 0, w, h);
    pieces = pieces.filter((p) => p.y < h + 40 && p.x > -60 && p.x < w + 60);
    for (const p of pieces) {
      p.vy += 0.32 * dt;
      p.vx *= Math.pow(0.985, dt);
      p.vy *= Math.pow(0.988, dt);
      p.x += (p.vx + Math.sin(p.tilt) * 0.6) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.tilt += p.vt * dt;
      // The flip: squash one axis and shade by the angle so foil glints as it turns.
      const flip = Math.cos(p.tilt);
      const light = 0.62 + 0.38 * Math.abs(flip);
      const [r, g, b] = p.hue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.max(0.12, Math.abs(flip)));
      ctx.fillStyle = `rgb(${(r * light) | 0},${(g * light) | 0},${(b * light) | 0})`;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      if (Math.abs(flip) > 0.92 && !p.strip) {
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h / 3);
      }
      ctx.restore();
    }
    raf = pieces.length ? requestAnimationFrame(frame) : 0;
    if (!raf) ctx.clearRect(0, 0, w, h);
  }

  size();
  window.addEventListener("resize", size);
  return {
    burst,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Soft synthesized sounds (only after the visitor turns sound on)     */
/* ------------------------------------------------------------------ */

function playTick(ac: AudioContext, final: boolean) {
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = final ? 1320 : 880;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.14);
}

function playPop(ac: AudioContext) {
  const t = ac.currentTime;
  const len = Math.floor(ac.sampleRate * 0.25);
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const noise = ac.createBufferSource();
  noise.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1400;
  const gain = ac.createGain();
  gain.gain.value = 0.5;
  noise.connect(filter).connect(gain).connect(ac.destination);
  noise.start(t);
  // a little chime on top
  [1568, 2093].forEach((f, i) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t + 0.15 + i * 0.09);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.17 + i * 0.09);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1 + i * 0.09);
    osc.connect(g).connect(ac.destination);
    osc.start(t + 0.15 + i * 0.09);
    osc.stop(t + 1.2 + i * 0.09);
  });
}

/* ------------------------------------------------------------------ */

/**
 * Chaithrika's birthday opening, played over the real homepage: the page loads
 * dimmed ("lights off"), a 10-second countdown runs on top, then the lights come
 * on and confetti fires from both bottom corners over the lit homepage before
 * the overlay clears. Plays once per browser session;
 * `?intro=1` forces it and `?intro=0` skips it.
 */
export default function BirthdayCountdown({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [remaining, setRemaining] = useState(COUNT_FROM);
  const [soundOn, setSoundOn] = useState(false);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strobeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);

  // Decide on the client whether to play (session storage and URL are browser-only).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("intro");
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked (private mode): play it.
    }
    /* eslint-disable react-hooks/set-state-in-effect -- depends on browser-only state */
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (param === "0" || (seen && param !== "1")) setPhase("done");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const strobe = useCallback((big: boolean) => {
    const el = strobeRef.current;
    if (!el) return;
    el.classList.remove(styles.flash, styles.bigFlash);
    void el.offsetWidth; // restart the animation
    el.classList.add(big ? styles.bigFlash : styles.flash);
  }, []);

  const lightsOn = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Ignore: it will simply play again next visit.
    }
    setRemaining(0);
    setPhase("lit");
  }, []);

  const finish = useCallback(() => {
    setPhase((p) => (p === "done" ? p : "leaving"));
  }, []);

  // The countdown: one tick per second, then lights on.
  useEffect(() => {
    if (phase !== "countdown") return;
    if (reduced) {
      const t = window.setTimeout(lightsOn, 600);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      if (remaining <= 1) {
        lightsOn();
      } else {
        setRemaining(remaining - 1);
      }
    }, 1000);
    return () => window.clearTimeout(t);
  }, [phase, remaining, reduced, lightsOn]);

  // Strobe + tick sound on every number.
  useEffect(() => {
    if (phase !== "countdown" || reduced) return;
    strobe(false);
    if (soundRef.current && audioRef.current) playTick(audioRef.current, remaining === 1);
  }, [phase, remaining, reduced, strobe]);

  // Lights on: big flash, corner blasts, then the greeting fades on its own.
  useEffect(() => {
    if (phase !== "lit") return;
    const timers: number[] = [];
    let confetti: ReturnType<typeof createConfetti> | null = null;
    if (!reduced && canvasRef.current) {
      strobe(true);
      confetti = createConfetti(canvasRef.current);
      const mobile = window.innerWidth < 640;
      const big = mobile ? 110 : 230;
      confetti.burst("left", big, 1);
      confetti.burst("right", big, 1);
      timers.push(window.setTimeout(() => confetti?.burst("left", Math.round(big * 0.45), 0.85), 650));
      timers.push(window.setTimeout(() => confetti?.burst("right", Math.round(big * 0.45), 0.85), 900));
      if (soundRef.current && audioRef.current) playPop(audioRef.current);
    }
    timers.push(window.setTimeout(finish, reduced ? 0 : CONFETTI_MS));
    return () => {
      timers.forEach(window.clearTimeout);
      // Let falling confetti finish if we're only moving on to "leaving".
      const c = confetti;
      window.setTimeout(() => c?.destroy(), 4000);
    };
  }, [phase, reduced, strobe, finish]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("done"), LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Lock scrolling while the lights are off; Escape skips or closes.
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    if (phase === "countdown") html.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (phase === "countdown") lightsOn();
      else finish();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = previous;
    };
  }, [phase, lightsOn, finish]);

  useEffect(() => () => void audioRef.current?.close(), []);

  function toggleSound() {
    const next = !soundRef.current;
    soundRef.current = next;
    setSoundOn(next);
    if (next && !audioRef.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) audioRef.current = new AC();
    }
    void audioRef.current?.resume();
  }

  const layerClass = [
    styles.layer,
    birthdayFonts,
    phase !== "countdown" && styles.lit,
    phase === "leaving" && styles.leaving,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* The homepage remounts as the lights come on, so its own entrance animation plays in view. */}
      <div key={phase === "countdown" ? "dim" : "lit"} inert={phase === "countdown"}>
        {children}
      </div>

      {phase !== "done" && (
        <div className={layerClass} role="dialog" aria-modal={phase === "countdown"} aria-label="Countdown">
          <div className={styles.dark} aria-hidden="true" />
          <div className={`${styles.spot} ${styles.spotL}`} aria-hidden="true" />
          <div className={`${styles.spot} ${styles.spotR}`} aria-hidden="true" />
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

          <div className={styles.countdown} aria-hidden={phase !== "countdown"}>
            <p className={styles.kicker}>Lights in</p>
            <div className={styles.dial}>
              <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
                <circle className={styles.ringTrack} cx="50" cy="50" r={RING_R} />
                <circle
                  className={styles.ringFill}
                  cx="50"
                  cy="50"
                  r={RING_R}
                  strokeDasharray={RING_LEN}
                  strokeDashoffset={RING_LEN * (remaining / COUNT_FROM)}
                />
              </svg>
              <span key={remaining} className={`${styles.number} ${styles.tick}`} aria-hidden="true">
                {remaining}
              </span>
            </div>
            <p className={styles.hint}>Something special is about to light up.</p>
            <span className={styles.sr}>A ten-second birthday countdown is playing. Press Skip or Escape to skip it.</span>
          </div>

          <div ref={strobeRef} className={styles.strobe} aria-hidden="true" />

          <div className={styles.controls}>
            <button type="button" className={styles.btn} onClick={toggleSound} aria-pressed={soundOn}>
              {soundOn ? "Sound on" : "Sound off"}
            </button>
            {phase === "countdown" && (
              <button type="button" className={styles.btn} onClick={lightsOn}>
                Skip
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
