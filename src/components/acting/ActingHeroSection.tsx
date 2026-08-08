"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Sparkle = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
  </svg>
);

export default function ActingHeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full h-svh min-h-[520px] overflow-hidden bg-black">

      {/* ── Background ── */}
      <Image
        src="/images/acting/placeholder-landscape.jpg"
        alt="Acting portfolio background"
        fill
        preload
        className={`object-cover object-center z-0 transition-opacity duration-1000 ${
          loaded ? "opacity-100 animate-ken-burns" : "opacity-0"
        }`}
        sizes="100vw"
      />

      {/* Scrim: keeps the wordmark legible up top and the caption/scroll-hint
          legible at the bottom, regardless of what's behind them */}
      <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.1)_55%,rgba(0,0,0,0.6)_82%,rgba(0,0,0,0.88)_100%)]" />

      {/* ── "Charming" + sparkles ── */}
      <div
        className={`absolute z-20 flex items-start gap-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          left-4 top-20
          sm:left-20 sm:top-28
          lg:left-68 lg:top-36
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <span className="font-playfair text-white italic font-semibold leading-none
          text-[clamp(2rem,7vw,4.75rem)]">
          Charming
        </span>

        <div
          className="relative shrink-0"
          style={{ width: "clamp(20px,3vw,46px)", height: "clamp(20px,3vw,46px)", marginTop: "-3px" }}
        >
          <Sparkle size={40}  className="absolute top-0    left-16    text-[#9fb7a6] animate-sparkle anim-delay-200" />
          <Sparkle size={40}  className="absolute bottom-22 left-18   text-[#9fb7a6] animate-sparkle anim-delay-500" />
          <Sparkle size={40}  className="absolute bottom-22 left-40   text-[#9fb7a6] animate-sparkle anim-delay-300" />
          <Sparkle size={136} className="absolute bottom-0  left-14.25 text-[#9fb7a6]" />
          <Sparkle size={11}  className="absolute bottom-0  left-4     text-[#9fb7a6] animate-sparkle anim-delay-400" />
        </div>
      </div>

      {/* ── ACTING ── */}
      <div
        className={`absolute inset-x-0 z-10 flex items-center justify-center
          transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${loaded ? "opacity-100 scale-100 blur-none" : "opacity-0 scale-95 blur-sm"}`}
        style={{ top: "16%", bottom: "26%" }}
      >
        <h1
          className="font-bebas text-white leading-none select-none w-full text-center"
          style={{
            fontSize:      "max(52px, 16.5vw)",
            letterSpacing: "0.06em",
            textShadow:    "0 4px 60px rgba(0,0,0,0.45), 0 1px 0 rgba(0,0,0,0.2)",
          }}
        >
          ACTING
        </h1>
      </div>

      {/* ── Figure placeholder ── */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-20
          w-[80vw] sm:w-[55vw] md:w-[44vw] lg:w-[50vw] xl:w-[18vw]
          max-w-100
          transition-all duration-1200 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        style={{ height: "clamp(280px, 80svh, 1000px)" }}
      >
        {/* Soft ground glow gives the cutout figure a sense of depth against the flat scrim */}
        <div className="absolute inset-x-[10%] bottom-0 h-1/3 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)]" />
        <Image
          src="/images/acting/placeholder-figure.png"
          alt="Acting portfolio figure placeholder"
          fill
          loading="eager"
          className="object-contain object-bottom scale-100 sm:scale-115 lg:scale-138"
          style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.70))" }}
          sizes="(max-width: 480px) 80vw, (max-width: 768px) 55vw, (max-width: 1024px) 44vw, 21vw"
        />
      </div>

      {/* ── Bottom row ── */}
      <div
        className={`absolute z-20 flex items-center justify-between gap-4
          transition-all duration-700 delay-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          left-4 right-4 bottom-16
          sm:bottom-auto sm:left-[10vw] sm:right-[10vw] sm:top-[60vh]
          lg:top-[clamp(1.2rem,60vh,30.75rem)] lg:left-[clamp(1.2rem,20vw,15.5rem)] lg:right-[clamp(1.2rem,20vw,16.5rem)]
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <p className="font-inter text-white font-medium leading-snug
          text-[clamp(0.85rem,4vw,1.94rem)]
          [text-shadow:0_2px_16px_rgba(0,0,0,1)]">
          Screen Presence,
          <br />
          Stage Craft.
        </p>

        <span className="font-medium text-white/85 uppercase shrink-0 hidden sm:block
          text-[clamp(0.8rem,2vw,1.44rem)]
          [text-shadow:0_2px_16px_rgba(0,0,0,1)]">
          Actor
        </span>
      </div>

      {/* ── Scroll hint ── */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2
          pointer-events-none transition-all duration-700 delay-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <span className="font-inter text-[9px] uppercase tracking-[0.32em] text-white/55">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/15">
          <div className="absolute inset-x-0 top-0 h-1/2 animate-float bg-linear-to-b from-transparent via-white/80 to-transparent" />
        </div>
      </div>

    </section>
  );
}
