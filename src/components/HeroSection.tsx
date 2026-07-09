"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Sparkle = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
  </svg>
);

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full h-svh min-h-[560px] max-h-[900px] overflow-hidden bg-black">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/bg.png"
          alt="Runway background"
          fill
          priority
          className={`object-cover object-center transition-opacity duration-1000 ${
            loaded ? "opacity-100 animate-ken-burns" : "opacity-0"
          }`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/25 to-black/60" />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/65" />
      </div>

      {/* "Charming" + sparkle cluster — top left */}
      <div
        className={`absolute top-8 left-8 sm:top-10 sm:left-10 lg:top-12 lg:left-14 z-20
          flex items-start gap-2 transition-all duration-700
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <span
          className="font-playfair text-white italic font-semibold text-2xl sm:text-3xl lg:text-[2.2rem]"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}
        >
          Charming
        </span>

        {/* Three sparkles: small top-left, large center, small bottom-right */}
        <div className="relative w-9 h-9 sm:w-11 sm:h-11 -mt-1">
          <Sparkle size={9}  className="absolute top-0 left-0 text-[#c9a84c] animate-sparkle delay-200" />
          <Sparkle size={20} className="absolute top-1 left-3 text-[#c9a84c] animate-sparkle" />
          <Sparkle size={11} className="absolute top-5 left-6 text-[#c9a84c] animate-sparkle delay-400" />
        </div>
      </div>

      {/* CHAITHRIKA — large centered, upper-middle of hero */}
      <div
        className={`absolute inset-x-0 z-10 flex items-center justify-center
          transition-all duration-1000 delay-300
          ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ top: "18%", bottom: "28%" }}
      >
        <h1
          className="font-bebas text-white leading-none select-none w-full text-center"
          style={{
            fontSize: "clamp(72px, 16vw, 272px)",
            letterSpacing: "0.06em",
            textShadow: "0 4px 40px rgba(0,0,0,0.35)",
          }}
        >
          CHAITHRIKA
        </h1>
      </div>

      {/* Chaithrika figure — bottom-anchored, overlaps text */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-20
          transition-all duration-[1200ms] delay-500
          h-[82%] sm:h-[87%] lg:h-[92%]
          w-[36vw] sm:w-[27vw] lg:w-[21vw] max-w-[360px]
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <Image
          src="/images/hero/chaithrika.png"
          alt="Chaithrika"
          fill
          priority
          className="object-contain object-bottom drop-shadow-2xl"
          sizes="(max-width: 640px) 36vw, (max-width: 1024px) 27vw, 21vw"
        />
      </div>

      {/* Bottom row — subtitle left, label right */}
      <div
        className={`absolute bottom-6 sm:bottom-8 lg:bottom-10
          left-8 right-8 sm:left-10 sm:right-10 lg:left-14 lg:right-14
          z-20 flex items-end justify-between
          transition-all duration-700 delay-700
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <p
          className="font-inter text-white font-light leading-snug text-sm sm:text-base lg:text-xl"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
        >
          Explore My Style,
          <br />
          Follow My Journey.
        </p>

        <span
          className="font-inter text-white uppercase shrink-0
            tracking-[0.22em] sm:tracking-[0.3em]
            text-[9px] sm:text-[11px] lg:text-sm"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
        >
          Model and Actress
        </span>
      </div>

      {/* Scroll line */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 animate-float hidden sm:block">
        <div className="w-px h-10 bg-linear-to-b from-transparent to-white/60 mx-auto" />
      </div>
    </section>
  );
}
