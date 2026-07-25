"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.08) {
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

// w/h props set the intrinsic aspect ratio; h-auto then renders at that ratio filling column width
const photos = [
  { src: "/images/modeling/826b469d6b8587ca9ca8d9c3a7a3916e.jpg", alt: "White dress", w: 600, h: 800 },
  { src: "/images/modeling/3005248305dc5a621343f6cd29ac79a8.jpg", alt: "Blue ball gown", w: 600, h: 750 },
  { src: "/images/modeling/4d5a5c7ce41a772b8de50c92769a3c48.jpg", alt: "Outdoor lehenga", w: 600, h: 800 },
  { src: "/images/modeling/effc021251ec6bab0e2d6b62e6aaf173.jpg", alt: "Red saree", w: 600, h: 900 },
  { src: "/images/modeling/d836b3be1726eca9280fca4cee202665.jpg", alt: "Backstage mirror", w: 600, h: 600 },
  { src: "/images/modeling/711d092589eb647812b11440c0385b34.jpg", alt: "Floral gown", w: 600, h: 900 },
  { src: "/images/modeling/cb5e0e7e0626995381ec6faaff8dc347.jpg", alt: "Blue ethnic", w: 600, h: 750 },
  { src: "/images/modeling/3c0b7b1884d27e601f62b63157871af0.jpg", alt: "Birthday princess", w: 600, h: 600 },
  { src: "/images/modeling/f8a150964162d626ff684ffdf37850bc.jpg", alt: "Park bench", w: 600, h: 700 },
  { src: "/images/modeling/6f3770f204fac1437841a24b67396283.jpg", alt: "Candid portrait", w: 600, h: 800 },
];

const DELAYS = [
  "delay-0", "delay-150", "delay-300", "delay-150", "delay-0",
  "delay-300", "delay-0",  "delay-150", "delay-300", "delay-150",
];

export default function GallerySection() {
  const { ref, inView } = useInView();

  return (
    <section className="bg-black py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-16 overflow-hidden">
      <div ref={ref} className="container mx-auto">

        {/* ── Heading ── */}
        <div
          className={`mb-8 sm:mb-12 transition-all duration-700
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="font-inter text-[#c9a84c] text-[10px] uppercase tracking-[0.38em] mb-3">
            Gallery
          </p>
          <h2 className="font-bebas text-white leading-[0.88] tracking-[-0.02em]
            text-[clamp(3rem,10vw,9rem)]">
            Work With Me
          </h2>
          <div className="w-full h-px bg-white/10 mt-6 sm:mt-8" />
        </div>

        {/* ── Masonry (CSS columns) ── */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3 lg:gap-4">
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className={`break-inside-avoid mb-2 sm:mb-3 lg:mb-4
                transition-all duration-700 ${DELAYS[i]}
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="overflow-hidden rounded-xl sm:rounded-2xl group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  className="w-full h-auto object-cover object-top
                    transition-transform duration-500 group-hover:scale-[1.05] block"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
