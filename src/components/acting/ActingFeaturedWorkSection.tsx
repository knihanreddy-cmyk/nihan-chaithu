"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const works = [
  {
    num: "01",
    date: "TBA",
    label: "Location TBA",
    title: "Short Film",
    description:
      "Details and stills for this project will be added once the shoot wraps.",
    cta: "View Gallery",
    photo: "/images/acting/placeholder-landscape.jpg",
    pos: "50% 16%",
  },
  {
    num: "02",
    date: "TBA",
    label: "Location TBA",
    title: "Stage Performance",
    description:
      "Details and stills for this performance will be added once photos are ready.",
    cta: "See More",
    photo: "/images/acting/placeholder-portrait.jpg",
    pos: "50% 14%",
  },
];

function WorkRow({
  work,
  reverse,
}: {
  work: (typeof works)[0];
  reverse: boolean;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <article
      ref={ref}
      className={`grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10 ${
        reverse ? "" : ""
      }`}
    >
      <div
        className={`image-frame group relative aspect-[4/5] min-h-[420px] transition-all duration-700 sm:aspect-[5/4] lg:col-span-7 lg:min-h-[600px] ${
          reverse ? "lg:order-2" : ""
        } ${
          inView
            ? "translate-y-0 opacity-100"
            : reverse
              ? "translate-y-8 opacity-0 lg:translate-x-10"
              : "translate-y-8 opacity-0 lg:-translate-x-10"
        }`}
      >
        <Image
          src={work.photo}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ objectPosition: work.pos }}
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div
        className={`transition-all delay-150 duration-700 lg:col-span-5 ${
          reverse ? "lg:order-1 lg:pr-8" : "lg:pl-8"
        } ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center border border-[#9fb7a6]/50 font-bebas text-3xl leading-none text-[#9fb7a6]">
          {work.num}
        </span>

        <div className="mb-4 flex flex-wrap gap-3 font-inter text-[10px] uppercase tracking-[0.18em] text-white/42">
          <span className="inline-flex items-center gap-2">
            <Calendar size={13} strokeWidth={1.7} />
            {work.date}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={13} strokeWidth={1.7} />
            {work.label}
          </span>
        </div>

        <h3 className="font-bebas text-[clamp(3rem,7vw,5.25rem)] leading-[0.86] text-white">
          {work.title}
        </h3>
        <div className="my-5 h-px w-12 bg-[#9fb7a6]" />
        <p className="max-w-md font-inter text-sm leading-7 text-white/60 sm:text-base">
          {work.description}
        </p>

        <a
          href="#gallery"
          className="group mt-7 inline-flex h-12 items-center gap-3 rounded-full border border-white/14 px-6 font-inter text-[10px] uppercase tracking-[0.2em] text-white/78 transition duration-300 hover:border-[#9fb7a6]/70 hover:text-[#9fb7a6]"
        >
          {work.cta}
          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </article>
  );
}

export default function ActingFeaturedWorkSection() {
  const { ref, inView } = useInView();

  return (
    <section className="bg-[#050505] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28">
      <div className="section-shell">
        <div
          ref={ref}
          className={`mb-12 transition-all duration-700 sm:mb-16 lg:mb-24 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-3 font-inter text-[10px] uppercase tracking-[0.28em] text-[#9fb7a6]">
            Portfolio
          </p>
          <h2 className="font-bebas text-[clamp(4rem,12vw,9rem)] leading-[0.82] text-white">
            Featured Work
          </h2>
          <div className="mt-8 h-px w-full bg-white/10" />
        </div>

        <div className="flex flex-col gap-16 sm:gap-20 lg:gap-28">
          {works.map((work, index) => (
            <WorkRow key={work.num} work={work} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
