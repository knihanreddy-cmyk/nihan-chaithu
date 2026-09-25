import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home Page Designs — Chaithrika & Nihan",
  description:
    "Ten gateway homepage designs that let visitors choose between Chaithrika's and Nihan's portfolios.",
};

const options = [
  { name: "Split Screen Expand", idea: "Two halves; the one you hover grows wider.", swatch: ["#F7F5F0", "#171614"] },
  { name: "Spotlight Stage", idea: "A dark theatre with a spotlight on each child.", swatch: ["#0A0908", "#C6A15B"] },
  { name: "Clean Cards", idea: "Apple-style photo cards that tilt with the mouse.", swatch: ["#FFFFFF", "#0071E3"] },
  { name: "Glass Portals", idea: "Frosted-glass frames over soft moving colour.", swatch: ["#F3EFF4", "#E58FB4"] },
  { name: "Double Cover", idea: "Two magazine covers; the chosen one opens like a page.", swatch: ["#E9E7E2", "#B21F5A"] },
  { name: "Diagonal Split", idea: "Bold pink and navy halves split on a slant.", swatch: ["#D63A7A", "#14213D"] },
  { name: "Soft Arches", idea: "Floating arch frames in linen and sage.", swatch: ["#EFE8DF", "#5A4B40"] },
  { name: "Character Select", idea: "A classy “choose your player” screen with arrow keys.", swatch: ["#12121A", "#FF6F91"] },
  { name: "Big Type Hover Reveal", idea: "Huge names; photos follow the cursor.", swatch: ["#EDEBE6", "#E4572E"] },
  { name: "Polaroid Table", idea: "Draggable polaroids tossed on a linen table.", swatch: ["#E8DCCB", "#3B2F27"] },
];

export default function HomePageDesignsIndex() {
  return (
    <main className="min-h-svh bg-[#050505] px-4 pb-24 pt-14 text-white sm:px-8 lg:px-16 lg:pt-20">
      <div className="mx-auto max-w-[1100px]">
        <header className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c]">
              Chaithrika &amp; Nihan
            </p>
            <h1 className="font-bebas text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.85]">
              Home Page Designs
            </h1>
          </div>
          <p className="max-w-sm font-inter text-sm leading-7 text-white/60">
            Ten ways to open the family site. Each one lets visitors choose
            Chaithrika or Nihan, then animates into that portfolio.
          </p>
        </header>

        <ol className="divide-y divide-white/10">
          {options.map((option, index) => {
            const number = index + 1;
            return (
              <li key={option.name}>
                <Link
                  href={`/home-page-designs/${number}`}
                  className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 outline-none focus-visible:bg-white/[0.04] sm:grid-cols-[4.5rem_1fr_auto] sm:gap-6"
                >
                  <span className="font-bebas text-3xl leading-none text-[#c9a84c] sm:text-4xl">
                    {String(number).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-playfair text-xl leading-tight transition-colors group-hover:text-[#e9d58b] group-focus-visible:text-[#e9d58b] sm:text-2xl">
                      {option.name}
                    </span>
                    <span className="mt-1 block font-inter text-[13px] leading-6 text-white/55">
                      {option.idea}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                      {option.swatch.map((color) => (
                        <span
                          key={color}
                          className="h-3 w-3 rounded-full border border-white/30"
                          style={{ background: color }}
                        />
                      ))}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-inter text-lg text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
