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
    <section className="relative w-full h-svh min-h-[520px] overflow-hidden bg-black">

      {/* ── Background — fills every pixel of the section ── */}
      <Image
        src="/images/hero/bg.png"
        alt="Runway background"
        fill
        priority
        className={`object-cover object-center z-0 transition-opacity duration-1000 ${
          loaded ? "opacity-100 animate-ken-burns" : "opacity-0"
        }`}
        sizes="100vw"
      />

      {/* ── Overlay stack (z-[1]) ── */}
      {/* Left / right edge darken so text is always readable */}
      {/* <div className="absolute inset-0 z-1 bg-linear-to-r from-black/80 via-black/10 to-black/70" /> */}
      {/* Top / bottom darken */}
      {/* <div className="absolute inset-0 z-1 bg-linear-to-b from-black/60 via-transparent to-black/88" /> */}
      {/* Soft radial vignette — pushes viewer eye to the figure */}
      <div
        className="absolute inset-0 z-1"
        // style={{
        //   background:
        //     "radial-gradient(ellipse 72% 78% at 50% 56%, transparent 32%, rgba(0,0,0,0.52) 100%)",
        // }}
      />

      {/* ── "Charming" + sparkle cluster ── */}
      <div
        className={`absolute z-20 flex items-start gap-2 transition-all duration-700  left-68 top-36 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
    
      >
        <span
          className="font-playfair text-white italic font-semibold leading-none text-[76px]"
        
        >
          Charming
        </span>

        {/* Diagonal trio: small / large / small */}
        <div
          className="relative shrink-0"
          style={{
            width:     "clamp(26px, 3vw, 46px)",
            height:    "clamp(26px, 3vw, 46px)",
            marginTop: "-3px",
          }}
        >
          <Sparkle size={40}  className="absolute top-0    left-16    text-[#906955]  delay-200" />
          <Sparkle size={40}  className="absolute bottom-22    left-18    text-[#906955]  delay-200" />
            <Sparkle size={40}  className="absolute bottom-22    left-40    text-[#906955]  delay-200" />
          <Sparkle size={136} className="absolute bottom-0  left-14.25 text-[#906955] " />
          <Sparkle size={11} className="absolute bottom-0 left-4  text-[#906955] animate-sparkle delay-400" />
        </div>
      </div>

      {/* ── CHAITHRIKA — spans ~88 % of viewport width at any size ── */}
      <div
        className={`absolute inset-x-0 z-10 flex items-center justify-center
          transition-all duration-1000 delay-300 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ top: "16%", bottom: "26%" }}
      >
        <h1
          className="font-bebas text-white leading-none select-none w-full text-center"
          style={{
            /* No upper cap — at 4 K (2560 px) this is 422 px and still fills ~88 % */
            fontSize:      "max(52px, 16.5vw)",
            letterSpacing: "0.06em",
            textShadow:    "0 4px 60px rgba(0,0,0,0.45), 0 1px 0 rgba(0,0,0,0.2)",
          }}
        >
          CHAIT HRIKA
        </h1>
      </div>

      {/* ── Chaithrika figure — bottom-anchored, overlaps name ── */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-20
          w-[46vw] sm:w-[32vw] md:w-[38vw] lg:w-[50vw] xl:w-[18vw]
          max-w-100
          transition-all duration-1200 delay-500 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 "
        }`}
          style={{ height: "clamp(500px, 95%, 1000px)" }}
      >
        <Image
          src="/images/hero/chaithrika.png"
          alt="Chaithrika"
          fill
          priority
          className="object-contain object-bottom  scale-138 "
          style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.70))" }}
          sizes="(max-width: 480px) 46vw, (max-width: 768px) 32vw, (max-width: 1024px) 26vw, 21vw "
        />
      </div>

      {/* ── Bottom row ── */}
      <div
        className={`absolute z-20 flex items-center justify-between gap-4
          transition-all duration-700 delay-700 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          top:      "clamp(1.2rem, 60vh, 30.75rem)",
          left:        "clamp(1.2rem, 20vw, 15.5rem)",
          right:       "clamp(1.2rem, 20vw, 16.5rem)",
        
        }}
      >
        <p
          className="font-inter text-white font-medium leading-snug text-[31px]"
          style={{
            textShadow: "0 2px 16px rgba(0,0,0,1)",
          }}
        >
          Explore My Style,
          <br />
          Follow My Journey.
        </p>

        <span
          className="font-medium text-white/85 uppercase shrink-0 hidden sm:block text-[23px] "
          style={{
            textShadow:    "0 2px 16px rgba(0,0,0,1)",
          }}
        >
          Model and Actress
        </span>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-float hidden md:block pointer-events-none">
        <div className="w-px h-10 bg-linear-to-b from-transparent to-white/40 mx-auto" />
      </div>
    </section>
  );
}
