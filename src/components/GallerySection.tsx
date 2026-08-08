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
  {
    src: "/images/modeling/826b469d6b8587ca9ca8d9c3a7a3916e.jpg",
    alt: "Chaithrika in a white dress",
    w: 1600,
    h: 2400,
  },
  {
    src: "/images/modeling/3005248305dc5a621343f6cd29ac79a8.jpg",
    alt: "Chaithrika in a blue ball gown",
    w: 1600,
    h: 2399,
  },
  {
    src: "/images/modeling/4d5a5c7ce41a772b8de50c92769a3c48.jpg",
    alt: "Chaithrika outdoor fashion portrait",
    w: 1599,
    h: 1067,
  },
  {
    src: "/images/modeling/effc021251ec6bab0e2d6b62e6aaf173.jpg",
    alt: "Chaithrika in a red saree",
    w: 1200,
    h: 1600,
  },
  {
    src: "/images/modeling/d836b3be1726eca9280fca4cee202665.jpg",
    alt: "Chaithrika backstage portrait",
    w: 1201,
    h: 1599,
  },
  {
    src: "/images/modeling/711d092589eb647812b11440c0385b34.jpg",
    alt: "Chaithrika in a floral gown",
    w: 1600,
    h: 2399,
  },
  {
    src: "/images/modeling/cb5e0e7e0626995381ec6faaff8dc347.jpg",
    alt: "Chaithrika in blue ethnic wear",
    w: 1200,
    h: 1600,
  },
  {
    src: "/images/modeling/3c0b7b1884d27e601f62b63157871af0.jpg",
    alt: "Chaithrika festive portrait",
    w: 1200,
    h: 1600,
  },
  {
    src: "/images/modeling/f8a150964162d626ff684ffdf37850bc.jpg",
    alt: "Chaithrika on a park bench",
    w: 1200,
    h: 1600,
  },
  {
    src: "/images/modeling/6f3770f204fac1437841a24b67396283.jpg",
    alt: "Chaithrika candid portrait",
    w: 600,
    h: 800,
  },
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

export default function GallerySection() {
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
          <p className="mb-3 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c]">
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
              key={photo.src}
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
