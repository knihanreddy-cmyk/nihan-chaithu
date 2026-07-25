"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.12) {
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

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
    <path
      d="M1 6h10M6 1l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const works = [
  {
    num: "01",
    date: "2024",
    label: "Pinnacle Business Park",
    title: "Brand Photoshoot",
    description:
      "A brand campaign shot at one of Bangalore's premier business destinations — capturing confidence, couture, and camera presence.",
    cta: "View Campaign",
    photo: "/images/featured_works/e643c18c911698d2b1c6f26951bab888.jpg",
    pos: "15% 15%",
  },
  {
    num: "02",
    date: "Dec 18 · 2024",
    label: "India Kids Fashion Week",
    title: "Runway Show",
    description:
      "Taking the stage at IKFW Season 11 — a showcase of poise and grace that brought the crowd to its feet.",
    cta: "Watch the Reel",
    photo: "/images/featured_works/d67b374abf8d99540107eef87e4b9f71.jpg",
    pos: "center center",
  },
];

function WorkRow({
  work,
  reverse,
}: {
  work: (typeof works)[0];
  reverse: boolean;
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-stretch gap-6 sm:gap-8 lg:gap-14`}
    >
      {/* Photo */}
      <div
        className={`md:w-[58%] relative overflow-hidden rounded-2xl sm:rounded-3xl
          aspect-3/4 sm:aspect-4/3 md:aspect-auto md:min-h-110 lg:min-h-130
          group transition-all duration-700 ease-out
          ${inView
            ? "opacity-100 translate-x-0"
            : `opacity-0 ${reverse ? "translate-x-10" : "-translate-x-10"}`
          }`}
      >
        <Image
          src={work.photo}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ objectPosition: work.pos }}
          sizes="(max-width: 768px) 100vw, 58vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`md:w-[42%] flex flex-col justify-center
          ${reverse ? "md:pr-4 lg:pr-8" : "md:pl-4 lg:pl-8"}
          transition-all duration-700 ease-out delay-150
          ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <span className="font-bebas text-[#c9a84c] leading-none mb-3 sm:mb-4 select-none
          text-[clamp(2.5rem,6vw,5.5rem)]">
          {work.num}
        </span>
        <p className="font-inter text-white/35 uppercase tracking-[0.32em] text-[9px] mb-1">
          {work.date}
        </p>
        <p className="font-inter text-white/50 uppercase tracking-[0.2em] text-[10px] mb-4">
          {work.label}
        </p>
        <h3 className="font-bebas text-white leading-none tracking-wide mb-4 sm:mb-5
          text-[clamp(2rem,4.5vw,3.8rem)]">
          {work.title}
        </h3>
        <div className="w-10 h-px bg-[#c9a84c] mb-4 sm:mb-5" />
        <p className="font-inter text-white/50 text-[13px] leading-[1.75] mb-7 sm:mb-8 max-w-full sm:max-w-xs">
          {work.description}
        </p>
        <a
          href="#"
          className="group/btn inline-flex items-center gap-2.5 w-fit
            font-inter text-[10px] uppercase tracking-[0.26em]
            text-white border border-white/20
            hover:border-[#c9a84c] hover:text-[#c9a84c]
            px-6 py-3 rounded-full transition-all duration-300"
        >
          {work.cta}
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
            <ArrowRight />
          </span>
        </a>
      </div>
    </div>
  );
}

export default function FeaturedWorkSection() {
  const { ref, inView } = useInView();

  return (
    <section className="bg-black py-16 sm:py-24 lg:py-32 px-5 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={ref}
          className={`mb-10 sm:mb-14 lg:mb-24 transition-all duration-700 ease-out
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="font-inter text-[#c9a84c] text-[10px] tracking-[0.38em] uppercase mb-3">
            Portfolio
          </p>
          <h2 className="font-bebas text-white leading-[0.88] tracking-[-0.01em]
            text-[clamp(4rem,10vw,9rem)]">
            FEATURED<br />WORK
          </h2>
          <div className="w-full h-px bg-white/10 mt-8" />
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-12 sm:gap-20 lg:gap-32">
          {works.map((work, i) => (
            <WorkRow key={work.num} work={work} reverse={i % 2 === 1} />
          ))}
        </div>

      </div>
    </section>
  );
}
