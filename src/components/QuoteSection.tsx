"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
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
    <section ref={ref} className="bg-black py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <blockquote
          className="font-inter font-bold text-white uppercase leading-tight tracking-wide
            text-lg sm:text-xl md:text-2xl lg:text-3xl
            max-w-70 sm:max-w-sm lg:max-w-md"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-36px)",
            transition: "opacity 0.9s ease 0ms, transform 0.9s ease 0ms",
          }}
        >
          Modeling and Acting are similar in some ways and completely different
          in others. I enjoy the challenge that each type of work brings.
        </blockquote>
      </div>
    </section>
  );
}
