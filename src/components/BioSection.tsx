"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function animStyle(inView: boolean, delayMs: number) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.94)",
    transition: `opacity 0.65s ease ${delayMs}ms, transform 0.65s ease ${delayMs}ms`,
  };
}

export default function BioSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="bg-black py-14 sm:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* BIO heading */}
        <div className="flex justify-end mb-6 sm:mb-10">
          <h2
            className="font-bebas tracking-widest text-white
              text-6xl sm:text-8xl lg:text-9xl"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.7s ease 0ms, transform 0.7s ease 0ms",
            }}
          >
            BIO
          </h2>
        </div>

        {/* ── Mobile layout (< sm 640px): stacked ── */}
        <div className="sm:hidden space-y-5">
          {/* Bio text */}
          <p
            className="font-inter text-white text-xs leading-relaxed tracking-widest uppercase text-right"
            style={animStyle(inView, 100)}
          >
            Fashion-Forward and Performance-Driven — From India Kids Fashion Week
            Season 11 (IKFW) to Amazon Kids Dress, With Three Years of Acting
            Experience Bringing Style, Creativity, and Storytelling to Life.
          </p>

          {/* 2-col photo grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tall center photo spans 2 rows */}
            <div
              className="photo-hover rounded-xl overflow-hidden row-span-2 aspect-2/3"
              style={animStyle(inView, 150)}
            >
              <Image src="/images/bio/321410e0258a17ffe27b788771ce7a5f.jpg" alt="Red dress" width={300} height={450}
                className="w-full h-full object-cover" />
            </div>

            <div className="photo-hover rounded-xl overflow-hidden aspect-4/5" style={animStyle(inView, 200)}>
              <Image src="/images/bio/3097497f8498d5234237af1a1cdbcd96.png" alt="Casual" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
            <div className="photo-hover rounded-xl overflow-hidden aspect-4/5" style={animStyle(inView, 250)}>
              <Image src="/images/bio/89797d9d509176ebf0e1549939a2509f.jpg" alt="Blue skirt" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="photo-hover rounded-xl overflow-hidden aspect-4/5" style={animStyle(inView, 300)}>
              <Image src="/images/bio/baa1183d4b5df4bac78bd08850b8e544.jpg" alt="Ethnic" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
            <div className="photo-hover rounded-xl overflow-hidden aspect-4/5" style={animStyle(inView, 350)}>
              <Image src="/images/bio/0211e3de91be30efb167447806dd54a9.jpg" alt="Fairy" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* ── Tablet / Desktop layout (sm+) ── */}
        <div className="hidden sm:block">
          {/* Row 1: small photo | bio text | tall red dress */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6 items-start mb-4 lg:mb-6">
            {/* Small casual */}
            <div className="photo-hover rounded-2xl overflow-hidden aspect-4/5"
              style={animStyle(inView, 100)}>
              <Image src="/images/bio/3097497f8498d5234237af1a1cdbcd96.png" alt="Casual" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>

            {/* Bio text */}
            <div className="flex items-center h-full" style={animStyle(inView, 200)}>
              <p className="font-inter text-white leading-relaxed tracking-widest uppercase text-right
                text-[10px] lg:text-xs">
                Fashion-Forward and
                <br />Performance-Driven — From
                <br />India Kids Fashion Week
                <br />Season 11 (IKFW) to Amazon
                <br />Kids Dress, With Three Years
                <br />of Acting Experience
                <br />Bringing Style, Creativity,
                <br />and Storytelling to Life.
              </p>
            </div>

            {/* Tall red dress — spans 2 rows */}
            <div
              className="photo-hover rounded-2xl overflow-hidden"
              style={{
                ...animStyle(inView, 300),
                gridRow: "1 / span 2",
                aspectRatio: "3/5",
              }}
            >
              <Image src="/images/bio/321410e0258a17ffe27b788771ce7a5f.jpg" alt="Red dress" width={320} height={530}
                className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Row 2: blue skirt | ethnic | (red dress continues in col 3) */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            <div className="photo-hover rounded-2xl overflow-hidden aspect-4/5"
              style={animStyle(inView, 350)}>
              <Image src="/images/bio/89797d9d509176ebf0e1549939a2509f.jpg" alt="Blue skirt" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
            <div className="photo-hover rounded-2xl overflow-hidden aspect-4/5"
              style={animStyle(inView, 420)}>
              <Image src="/images/bio/baa1183d4b5df4bac78bd08850b8e544.jpg" alt="Ethnic" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
            <div className="photo-hover rounded-2xl overflow-hidden aspect-4/5"
              style={animStyle(inView, 490)}>
              <Image src="/images/bio/0211e3de91be30efb167447806dd54a9.jpg" alt="Fairy" width={300} height={375}
                className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
