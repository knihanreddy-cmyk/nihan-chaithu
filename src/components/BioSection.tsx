"use client";

import Image from "next/image";

export default function BioSection() {
  return (
    <section className="bg-black overflow-hidden py-16 lg:py-0">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 items-center">

          {/* ── LEFT: overlapping photos ──
              Mobile: h-72 (288px) — photos repositioned to not overflow
              Desktop: h-170 (680px) — original positions restored with lg: */}
          <div className="relative h-72 sm:h-96 lg:h-170">

            {/* Small photo */}
            <div className="absolute top-4 z-20 shadow-2xl
              left-[5%] w-[40%]
              lg:top-6 lg:left-[20%] lg:w-[38%]
              aspect-square rounded-[32px] overflow-hidden">
              <Image
                src="/images/bio/3097497f8498d5234237af1a1cdbcd96.png"
                alt="Chaithrika casual"
                fill
                sizes="(max-width: 1024px) 40vw, 19vw"
                className="object-cover"
              />
            </div>

            {/* Large photo
                Mobile:  left-[33%] w-[63%] h-[75%] — stays within screen
                Desktop: left-[64%] w-[72%] h-[66%] — original overflow-hidden by section */}
            <div className="absolute rounded-[40px] overflow-hidden
              shadow-[0_40px_100px_rgba(0,0,0,0.6)]
              top-[20%] left-[33%] w-[63%] h-[75%]
              lg:top-[34%] lg:left-[64%] lg:w-[72%] lg:h-[66%]">
              <Image
                src="/images/bio/321410e0258a17ffe27b788771ce7a5f.jpg"
                alt="Chaithrika red dress"
                fill
                sizes="(max-width: 1024px) 63vw, 36vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* ── RIGHT: content ── */}
          <div className="text-white px-4 sm:px-6 lg:px-0 pt-8 pb-4 lg:pt-0 lg:pb-0">
            <h2 className="font-bebas uppercase leading-none mb-4 lg:mb-8 text-end
              text-[clamp(3.5rem,12vw,6.7rem)]">
              Bio
            </h2>
            <p className="text-white/80 uppercase tracking-wide leading-relaxed text-end
              text-[clamp(0.85rem,2.8vw,1.5rem)]">
              Fashion-forward and performance-driven —
              from India Kids Fashion Week Season 11
              (IKFW) to Amazon Kids Dress, with three
              years of acting experience bringing style,
              creativity, and storytelling to life.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
