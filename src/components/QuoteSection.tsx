"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
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

export default function QuoteSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className="bg-[#080808] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24"
    >
      <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div
          className={`transition-all duration-700 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-4 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c]">
            Perspective
          </p>
          <blockquote className="font-playfair text-[clamp(2.2rem,6vw,5.75rem)] font-semibold italic leading-[1.02] text-white">
            Modeling and acting both ask for presence. I love the challenge each
            one brings.
          </blockquote>
        </div>

        <div
          className={`image-frame relative aspect-[4/5] transition-all delay-150 duration-700 sm:aspect-[5/4] lg:aspect-[4/5] ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Image
            src="/images/modeling/826b469d6b8587ca9ca8d9c3a7a3916e.jpg"
            alt="Chaithrika in a white dress on a chair"
            fill
            className="object-cover object-[50%_15%]"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </div>
      </div>
    </section>
  );
}
