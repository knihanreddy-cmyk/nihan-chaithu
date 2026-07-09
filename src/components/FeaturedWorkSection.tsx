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

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="inline ml-1 align-middle">
    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const works = [
  {
    id: 1,
    label: "Pinnacle Business Park, 2024",
    sublabel: "Brand Photoshoot",
    cta: "Check out the page",
    photo: "/images/featured_works/e643c18c911698d2b1c6f26951bab888.jpg",
    delayMs: 150,
  },
  {
    id: 2,
    label: "Dec 18, 2024",
    sublabel: "Runway Show",
    cta: "Check out the reel",
    photo: "/images/featured_works/d67b374abf8d99540107eef87e4b9f71.jpg",
    delayMs: 300,
  },
];

export default function FeaturedWorkSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="bg-black py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div
          className="mb-8 sm:mb-10"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.7s ease 0ms, transform 0.7s ease 0ms",
          }}
        >
          <h2 className="font-bebas text-white leading-none
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            FEATURED
            <br />
            WORK
          </h2>
        </div>

        {/* Cards — 1 col on mobile, 2 cols on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 lg:gap-10">
          {works.map((w) => (
            <div
              key={w.id}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.65s ease ${w.delayMs}ms, transform 0.65s ease ${w.delayMs}ms`,
              }}
            >
              {/* Meta */}
              <div className="mb-3">
                <p className="font-inter text-white/50 tracking-widest uppercase text-[10px]">
                  {w.label}
                </p>
                <p className="font-inter text-white tracking-widest uppercase font-semibold text-[11px] sm:text-xs mt-0.5">
                  {w.sublabel}
                </p>
                <a
                  href="#"
                  className="font-inter text-[#c9a84c] tracking-widest uppercase hover:text-white transition-colors text-[10px]"
                >
                  {w.cta}
                  <ArrowIcon />
                </a>
              </div>

              {/* Photo */}
              <div className="photo-hover rounded-xl sm:rounded-2xl overflow-hidden aspect-4/3 relative">
                <Image
                  src={w.photo}
                  alt={w.sublabel}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
