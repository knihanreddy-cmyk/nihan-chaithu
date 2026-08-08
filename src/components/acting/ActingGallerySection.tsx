"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
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

const photos = [
  { src: "/images/acting/placeholder-portrait.jpg", alt: "Acting photo placeholder", w: 1200, h: 1600 },
  { src: "/images/acting/placeholder-square.jpg", alt: "Acting photo placeholder", w: 1200, h: 1200 },
  { src: "/images/acting/placeholder-landscape.jpg", alt: "Acting photo placeholder", w: 1600, h: 1067 },
  { src: "/images/acting/placeholder-portrait.jpg", alt: "Acting photo placeholder", w: 1200, h: 1600 },
  { src: "/images/acting/placeholder-square.jpg", alt: "Acting photo placeholder", w: 1200, h: 1200 },
  { src: "/images/acting/placeholder-portrait.jpg", alt: "Acting photo placeholder", w: 1200, h: 1600 },
  { src: "/images/acting/placeholder-landscape.jpg", alt: "Acting photo placeholder", w: 1600, h: 1067 },
  { src: "/images/acting/placeholder-square.jpg", alt: "Acting photo placeholder", w: 1200, h: 1200 },
  { src: "/images/acting/placeholder-portrait.jpg", alt: "Acting photo placeholder", w: 1200, h: 1600 },
  { src: "/images/acting/placeholder-square.jpg", alt: "Acting photo placeholder", w: 1200, h: 1200 },
];

const delays = [
  "delay-0",
  "delay-100",
  "delay-200",
  "delay-300",
  "delay-0",
  "delay-100",
  "delay-200",
  "delay-300",
  "delay-0",
  "delay-100",
];

export default function ActingGallerySection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="gallery"
      className="bg-[#050505] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28"
    >
      <div ref={ref} className="section-shell">
        <div
          className={`mb-8 transition-all duration-700 sm:mb-12 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="mb-3 font-inter text-[10px] uppercase tracking-[0.28em] text-[#9fb7a6]">
            Gallery
          </p>
          <h2 className="font-bebas text-[clamp(3.75rem,11vw,8.75rem)] leading-[0.86] text-white">
            Portfolio Gallery
          </h2>
          <div className="mt-7 h-px w-full bg-white/10" />
        </div>

        <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 xl:columns-4">
          {photos.map((photo, index) => (
            <div
              key={`${photo.src}-${index}`}
              className={`mb-3 break-inside-avoid transition-all duration-700 sm:mb-4 ${
                delays[index]
              } ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <div className="image-frame group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  className="h-auto w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
