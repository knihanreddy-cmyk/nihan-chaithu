"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const works = [
  {
    id: 1,
    title: "PINNACLE BUSINESS PARK, 2024",
    subtitle: "BRAND PHOTOSHOOT",
    cta: "CHECK OUT THE PAGE",
    image:
      "/images/featured_works/e643c18c911698d2b1c6f26951bab888.jpg",
  },
  {
    id: 2,
    title: "IKFW, 2024",
    subtitle: "RUNWAY SHOW",
    cta: "CHECK OUT THE REEL",
    image:
      "/images/featured_works/d67b374abf8d99540107eef87e4b9f71.jpg",
  },
];

const ArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="ml-2"
  >
    <path
      d="M12 4V20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 14L12 20L18 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FeaturedWorkSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="bg-black overflow-hidden py-20 md:py-28 lg:py-36"
    >
      <div className="container mx-auto px-6 md:px-10 lg:px-16">

        {/* Heading */}
        <div
          className={`transition-all duration-1000 ${inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
            }`}
        >
          <h2
            className="
              text-white
              font-light
              leading-[0.82]
              tracking-[-0.06em]
              text-[72px]
              sm:text-[100px]
              md:text-[107px]
              lg:text-[107px]
              xl:text-[107px]
            "
          >
            FEATURED
            <br />
            WORK
          </h2>
        </div>

        {/* Works Grid */}
        <div className=" lg:mt-24 grid lg:grid-cols-2 gap-16 lg:gap-24 items-end">

          {/* Left Card */}
          <div
            className={`lg:mt-28 transition-all duration-1000 delay-200 ${inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
              }`}
          >
            <div className="mb-6">

              <div className="flex items-start  justify-between">
                <div className="">
                  <h3 className="text-white font-bold  uppercase text-lg md:text-[16px] leading-tight">
                    {works[0].title}
                  </h3>

                  <h4 className="text-white font-bold uppercase text-lg md:text-[16px] leading-tight mt-1">
                    {works[0].subtitle}
                  </h4>
                </div>

                <ArrowIcon />
              </div>

              <a
                href="#"
                className="
                  inline-block
                  mt-5
                  text-white
                  uppercase
                  underline
                  underline-offset-4
                  text-sm
                  tracking-wide
                  hover:opacity-70
                  transition
                  md:text-[14px]
                "
              >
                {works[0].cta}
              </a>
            </div>

            <div className="relative h-[300px] w-[508px] rounded-[34px] overflow-hidden">
              <Image
                src={works[0].image}
                alt={works[0].subtitle}
                fill
                className="object-[15%_15%] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Card */}
          <div
            className={`transition-all duration-1000 delay-500 ${inView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
              }`}
          >
            <div className="mb-6">

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold uppercase text-lg md:text-xl leading-tight">
                    {works[1].title}
                  </h3>

                  <h4 className="text-white font-bold uppercase text-lg md:text-xl leading-tight mt-1">
                    {works[1].subtitle}
                  </h4>
                </div>

                <ArrowIcon />
              </div>

              <a
                href="#"
                className="
                  inline-block
                  mt-5
                  text-white
                  uppercase
                  underline
                  underline-offset-4
                  text-sm
                  tracking-wide
                  hover:opacity-70
                  transition
                "
              >
                {works[1].cta}
              </a>
            </div>

            <div className="relative aspect-[16/10] rounded-[34px] overflow-hidden">
              <Image
                src={works[1].image}
                alt={works[1].subtitle}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}