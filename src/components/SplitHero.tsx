"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Side = "left" | "right";

const PANELS = [
  {
    side: "left" as Side,
    title: "Modeling",
    subtitle: "Fashion · Runway · Editorial",
    image: "/images/modeling/3005248305dc5a621343f6cd29ac79a8.jpg",
    href: "/category-one",
  },
  {
    side: "right" as Side,
    title: "Acting",
    subtitle: "Screen · Stage · Performance",
    image: "/images/featured_works/d67b374abf8d99540107eef87e4b9f71.jpg",
    href: "/category-two",
  },
];

export default function SplitHero() {
  const [active, setActive] = useState<Side | null>(null);
  const [glow, setGlow] = useState({ x: 0, y: 0 });
  const [exiting, setExiting] = useState(false);
  const router = useRouter();

  function widthClass(side: Side) {
    if (!active) return "md:w-1/2";
    return active === side ? "md:w-[65%]" : "md:w-[35%]";
  }

  function handleClick(href: string) {
    setExiting(true);
    setTimeout(() => router.push(href), 550);
  }

  return (
    <main className={`h-svh w-full flex flex-col md:flex-row overflow-hidden bg-black
      transition-opacity duration-500
      ${exiting ? "opacity-0" : "opacity-100"}`}>

      {PANELS.map((panel) => {
        const on = active === panel.side;
        const dimmed = active !== null && active !== panel.side;

        return (
          <div
            key={panel.side}
            className={`relative flex items-center justify-center overflow-hidden
              cursor-pointer select-none
              h-1/2 w-full
              md:h-full
              md:transition-all md:duration-700
              md:[transition-timing-function:cubic-bezier(0.76,0,0.24,1)]
              ${widthClass(panel.side)}`}
            onMouseEnter={() => setActive(panel.side)}
            onMouseLeave={() => setActive(null)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setGlow({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            onClick={() => handleClick(panel.href)}
          >

            {/* ── Background image — zooms on hover ── */}
            <div
              className={`absolute inset-0 transition-transform duration-700
                [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]
                ${on ? "scale-[1.08]" : "scale-100"}`}
            >
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* ── Gradient overlay ── */}
            <div
              className={`absolute inset-0 transition-opacity duration-500
                bg-[linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0.5)_100%)]
                ${dimmed ? "opacity-100" : "opacity-85"}`}
            />

            {/* ── Cursor glow (desktop only) ── */}
            {on && (
              <div
                className="absolute inset-0 pointer-events-none hidden md:block"
                style={{
                  background: `radial-gradient(circle 320px at ${glow.x}px ${glow.y}px, rgba(201,168,76,0.13) 0%, transparent 70%)`,
                }}
              />
            )}

            {/* ── Panel text ── */}
            <div
              className={`relative z-10 text-center px-6 sm:px-10
                transition-all duration-500
                ${dimmed ? "opacity-50 translate-y-3" : "opacity-100 translate-y-0"}`}
            >
              {/* Eyebrow */}
              <p className="font-inter text-[#c9a84c] text-[9px] sm:text-[10px]
                uppercase tracking-[0.45em] mb-3 sm:mb-4">
                Portfolio
              </p>

              {/* Title — scales up when this panel is active */}
              <h2
                className={`font-bebas text-white leading-none
                  transition-all duration-700
                  [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]
                  ${on
                    ? "text-[clamp(4rem,8.5vw,9rem)]"
                    : "text-[clamp(2.8rem,5vw,5.5rem)]"}`}
              >
                {panel.title}
              </h2>

              {/* Subtitle */}
              <p
                className={`font-inter uppercase tracking-[0.22em] mt-2 sm:mt-3
                  text-[clamp(0.5rem,1.1vw,0.72rem)]
                  transition-colors duration-500
                  ${on ? "text-white/70" : "text-white/40"}`}
              >
                {panel.subtitle}
              </p>

              {/* Gold accent line — expands on hover */}
              <div
                className={`h-px bg-[#c9a84c] mx-auto mt-4 sm:mt-5
                  transition-all duration-700
                  ${on ? "w-16" : "w-8"}`}
              />

              {/* Explore prompt — fades in on hover */}
              <p
                className={`font-inter text-[9px] uppercase tracking-[0.4em] mt-4 sm:mt-5
                  text-white/40 transition-all duration-500
                  ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              >
                Explore →
              </p>
            </div>

          </div>
        );
      })}

      {/* ── Center divider line (desktop only, fades on hover) ── */}
      <div
        className={`hidden md:block absolute top-0 left-1/2 -translate-x-1/2
          h-full w-px bg-white/15 z-30 pointer-events-none
          transition-opacity duration-300
          ${active ? "opacity-0" : "opacity-100"}`}
      />

      {/* ── Site name watermark ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <p className="font-inter text-white/25 text-[9px] uppercase tracking-[0.45em]">
          Chaithrika
        </p>
      </div>

    </main>
  );
}
