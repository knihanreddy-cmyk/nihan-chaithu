"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { birthdayFonts } from "./fonts";
import styles from "./BirthdayCountdown.module.css";

/**
 * Module state survives client-side navigation but resets on every full page
 * load, so the countdown replays on any refresh (including Ctrl+Shift+R) but
 * not when the visitor comes back to the homepage from another page.
 */
let playedThisPageLoad = false;

const COUNT_FROM = 15;
/** How long the overlay stays after the lights come on, so the confetti can rise and fall. */
const CONFETTI_MS = 6400;
const GRAVITY = 0.32;
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
    for (let i = 0; i < count; i++) {
      // Aim up and inward: 55–84° above the horizon, towards the centre.
      const angle = ((55 + Math.random() * 29) * Math.PI) / 180;
      // Pick how high this piece should climb (55%–110% of the screen) and launch fast
      // enough to get there; the extra 18% makes up for air drag.
      const peak = h * (0.55 + Math.random() * 0.55) * power;
      const speed = Math.sqrt(2 * GRAVITY * peak) * 1.18 / Math.sin(angle);
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
      p.vy += GRAVITY * dt;
      p.vx *= Math.pow(0.985, dt);
      // Light drag going up so pieces reach the top; more drag coming down so they flutter.
      p.vy *= Math.pow(p.vy < 0 ? 0.995 : 0.975, dt);
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

function noiseBuffer(ac: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(ac.sampleRate * seconds);
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  return buffer;
}

/** A party-popper bang: a low thump plus a bright crack. `pan` is -1 (left) to 1 (right). */
function playPopper(ac: AudioContext, strength: number, pan: number, delay = 0) {
  const t = ac.currentTime + delay;
  const out = ac.createStereoPanner();
  out.pan.value = pan;
  out.connect(ac.destination);

  const thump = ac.createOscillator();
  const thumpGain = ac.createGain();
  thump.type = "sine";
  thump.frequency.setValueAtTime(150, t);
  thump.frequency.exponentialRampToValueAtTime(45, t + 0.18);
  thumpGain.gain.setValueAtTime(0.0001, t);
  thumpGain.gain.exponentialRampToValueAtTime(0.9 * strength, t + 0.008);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  thump.connect(thumpGain).connect(out);
  thump.start(t);
  thump.stop(t + 0.3);

  const crack = ac.createBufferSource();
  crack.buffer = noiseBuffer(ac, 0.3, 4);
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 900;
  const crackGain = ac.createGain();
  crackGain.gain.value = 1.1 * strength;
  crack.connect(hp).connect(crackGain).connect(out);
  crack.start(t);
}

/** Paper confetti rustling and crackling as it flies, for `seconds`. */
function playCrackle(ac: AudioContext, seconds: number, strength: number, delay = 0) {
  const t = ac.currentTime + delay;
  const len = Math.floor(ac.sampleRate * seconds);
  const buffer = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const fade = Math.pow(1 - i / len, 1.6);
      // Sparse random clicks over a soft hiss.
      const click = Math.random() < 0.004 ? (Math.random() * 2 - 1) * 0.9 : 0;
      data[i] = (click + (Math.random() * 2 - 1) * 0.06) * fade;
    }
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3200;
  bp.Q.value = 0.7;
  const gain = ac.createGain();
  gain.gain.value = 0.9 * strength;
  src.connect(bp).connect(gain).connect(ac.destination);
  src.start(t);
}

/** A bright two-note chime for "lights on". */
function playChime(ac: AudioContext, delay = 0) {
  const t = ac.currentTime + delay;
  [1568, 2093, 2637].forEach((f, i) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t + i * 0.08);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02 + i * 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3 + i * 0.08);
    osc.connect(g).connect(ac.destination);
    osc.start(t + i * 0.08);
    osc.stop(t + 1.4 + i * 0.08);
  });
}

/* ------------------------------------------------------------------ */

/**
 * Chaithrika's birthday opening, played over the real homepage: the page loads
 * dimmed ("lights off"), a 15-second countdown runs on top, then the lights come
 * on and confetti fires from both bottom corners over the lit homepage before
 * the overlay clears. Plays on every full page load (any refresh), not when
 * navigating back within the site; `?intro=0` skips it.
 */
export default function BirthdayCountdown({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [remaining, setRemaining] = useState(COUNT_FROM);
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strobeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(true);

  /** Returns the audio context only when sound is on and the browser has allowed it to play. */
  const audio = useCallback(() => {
    const ac = audioRef.current;
    return soundRef.current && ac && ac.state === "running" ? ac : null;
  }, []);

  // Sound is on by default. Browsers block audio until the visitor interacts with the
  // page, so create the context now and unlock it on the first tap, click or key.
  useEffect(() => {
    const AC =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    audioRef.current = ac;
    const unlock = () => {
      if (soundRef.current) void ac.resume();
    };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock));
      void ac.close();
      audioRef.current = null;
    };
  }, []);

  // Decide on the client whether to play (the URL and page-load state are browser-only).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("intro");
    /* eslint-disable react-hooks/set-state-in-effect -- depends on browser-only state */
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (param === "0" || playedThisPageLoad) setPhase("done");
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
    // Marked here rather than on mount so React's double-run of effects in development can't skip it.
    playedThisPageLoad = true;
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
    const ac = audio();
    if (ac) playTick(ac, remaining === 1);
  }, [phase, remaining, reduced, strobe, audio]);

  // Lights on: big flash, a barrage of corner blasts with popper sounds, then the overlay clears.
  useEffect(() => {
    if (phase !== "lit") return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    let confetti: ReturnType<typeof createConfetti> | null = null;
    if (!reduced && canvasRef.current) {
      strobe(true);
      confetti = createConfetti(canvasRef.current);
      const c = confetti;
      const mobile = window.innerWidth < 640;
      const big = mobile ? 190 : 380;
      const fire = (side: "left" | "right", count: number, power: number, loud: number) => {
        c.burst(side, count, power);
        const ac = audio();
        if (ac) playPopper(ac, loud, side === "left" ? -0.7 : 0.7);
      };

      // The main double blast, with a chime and paper crackle.
      fire("left", big, 1, 1);
      fire("right", big, 1, 1);
      const ac = audio();
      if (ac) {
        playChime(ac, 0.12);
        playCrackle(ac, 3.2, 1, 0.05);
      }
      // Follow-up volleys from alternating corners.
      at(380, () => {
        fire("left", Math.round(big * 0.55), 0.95, 0.8);
        fire("right", Math.round(big * 0.55), 0.95, 0.8);
      });
      at(850, () => fire("left", Math.round(big * 0.45), 0.9, 0.7));
      at(1100, () => fire("right", Math.round(big * 0.45), 0.9, 0.7));
      at(1600, () => {
        fire("left", Math.round(big * 0.4), 0.85, 0.65);
        fire("right", Math.round(big * 0.4), 0.85, 0.65);
        const later = audio();
        if (later) playCrackle(later, 2.4, 0.8);
      });
      // A short fountain of small bursts to keep it going.
      for (let i = 0; i < 12; i++) {
        at(2000 + i * 140, () => c.burst(i % 2 ? "right" : "left", mobile ? 10 : 18, 0.8));
      }
    }
    at(reduced ? 0 : CONFETTI_MS, finish);
    return () => {
      timers.forEach(window.clearTimeout);
      // Let falling confetti finish if we're only moving on to "leaving".
      const c = confetti;
      window.setTimeout(() => c?.destroy(), 4000);
    };
  }, [phase, reduced, strobe, finish, audio]);

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
            <span className={styles.sr}>A fifteen-second birthday countdown is playing. Press Skip or Escape to skip it.</span>
          </div>

          <div ref={strobeRef} className={styles.strobe} aria-hidden="true" />

          <div className={styles.controls}>
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
