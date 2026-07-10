"use client";

import Image from "next/image";

export default function BioSection() {
  return (
    <section className="bg-black overflow-hidden container mx-auto  ">
      <div className="    ">
        <div className="grid lg:grid-cols-2 items-center ">

          {/* ── LEFT: overlapping photos ── */}
          <div className="relative h-120 sm:h-145 lg:h-170">

            {/* Small image — top-left, ~38% of column width */}
            <div className="absolute top-6 left-[20%] w-[38%] aspect-10/10 rounded-[32px] overflow-hidden z-20 shadow-2xl">
              <Image
                src="/images/bio/3097497f8498d5234237af1a1cdbcd96.png"
                alt="Chaithrika casual"
                fill
                sizes="(max-width: 1024px) 38vw, 19vw"
                className="object-cover"
              />
            </div>

            {/* Large image — offset down-right, ~72% wide, 4:5 ratio */}
            <div className=" w-[440px]
              h-[450px] absolute top-[34%] left-[64%] w-[72%] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              
            >
              <Image
                src="/images/bio/321410e0258a17ffe27b788771ce7a5f.jpg"
                alt="Chaithrika red dress"
                fill
                sizes="(max-width: 1024px) 72vw, 36vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* ── RIGHT: content ── */}
          <div className="text-white">
            <h2
              className="font-bebas uppercase leading-none mb-8 text-[107px] text-end"

            >
              Bio
            </h2>

            <p
              className="text-white/80 uppercase tracking-wide leading-relaxed text-[24px] text-end"

            >
              Fashion-forward and <br /> performance-driven —
              from <br />India Kids Fashion Week <br />Season 11
              (IKFW) to Amazon  <br />Kids Dress, with three
              years  <br />of acting experience <br />bringing style,
              creativity,<br /> and storytelling to life.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
