"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
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

export default function QuoteSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="bg-black py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="container mx-auto flex flex-col sm:flex-row items-center gap-10 sm:gap-12 lg:gap-16">

        {/* Left — quote text */}
        <div
          className="sm:w-1/2"
          style={{
            opacity:    inView ? 1 : 0,
            transform:  inView ? "translateX(0)" : "translateX(-36px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <blockquote
            className="font-inter font-medium text-white uppercase leading-tight tracking-wide
              text-xl sm:text-2xl md:text-3xl lg:text-[40px]"
          >
            Modeling and Acting are similar in some ways and completely different
            in others. I enjoy the challenge that each type of work brings.
          </blockquote>
        </div>

        {/* Right — photo */}
        <div
          className="sm:w-1/2 w-full relative rounded-2xl sm:rounded-3xl overflow-hidden
            aspect-5/4 max-w-sm sm:max-w-none"
          style={{
            opacity:    inView ? 1 : 0,
            transform:  inView ? "translateX(0)" : "translateX(36px)",
            transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}
        >
          <Image
            src="/images/modeling/826b469d6b8587ca9ca8d9c3a7a3916e.jpg"
            alt="Chaithrika in white dress on chair"
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>

      </div>
    </section>
  );
}
