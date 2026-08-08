"use client";

import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem } from "./portfolioData";

type Props = {
  item: PortfolioItem;
  index: number;
  widthPercent: number;
  active: boolean;
  dimmed: boolean;
  loaded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onMouseMove: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function PortfolioCard({
  item,
  index,
  widthPercent,
  active,
  dimmed,
  loaded,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onMouseMove,
}: Props) {
  const style = {
    "--panel-accent": item.accent,
    "--panel-width": `${widthPercent}%`,
  } as CSSProperties;

  return (
    <Link
      href={item.href}
      style={style}
      aria-label={`View ${item.category} portfolio`}
      className={`portfolio-card group relative flex min-h-[68svh] w-full items-end overflow-hidden
        @container px-6 pb-10 text-left outline-none
        transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        focus-visible:z-20 focus-visible:outline-solid focus-visible:outline-2
        focus-visible:outline-offset-[-6px] focus-visible:outline-white/85
        sm:px-10 sm:pb-14 md:min-h-svh md:w-(--panel-width) lg:px-16
        ${loaded ? "animate-fade-up" : "opacity-0"}
        ${index === 1 ? "anim-delay-200" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseMove={onMouseMove}
    >
      <Image
        src={item.image}
        alt={`${item.category} portfolio preview`}
        fill
        loading="eager"
        className={`object-cover ${item.imageClass} transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active ? "scale-[1.04]" : "scale-100"
        } ${dimmed ? "brightness-[0.82] saturate-[0.82]" : "brightness-100 saturate-100"}`}
        sizes="(max-width: 768px) 100vw, 68vw"
      />

      {/* Bottom-anchored scrim only — keeps face, outfit, and upper body bright */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.45)_30%,rgba(0,0,0,0)_65%)]" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-4 flex items-center gap-3 font-inter text-[10px] tracking-[0.3em] text-(--panel-accent)">
          <span>{item.number}</span>
          <span className="h-px w-8 bg-white/20" />
        </div>

        <h2
          className="font-bebas text-[clamp(2.75rem,15cqw,8rem)] leading-[0.82] text-white
            transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:-translate-y-2 group-focus-visible:-translate-y-2"
        >
          {item.category}
        </h2>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xs font-inter text-sm leading-6 text-white/68 sm:text-base">
            {item.description}
          </p>

          <span className="inline-flex items-center gap-4">
            <span
              className="font-inter text-[10px] uppercase tracking-[0.26em] text-white/80
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:tracking-[0.34em] group-hover:text-white
                group-focus-visible:tracking-[0.34em] group-focus-visible:text-white"
            >
              Explore
            </span>
            <span
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:h-13 group-hover:w-13 group-hover:border-(--panel-accent)
                group-focus-visible:h-13 group-focus-visible:w-13 group-focus-visible:border-(--panel-accent)"
            >
              <ArrowUpRight
                size={16}
                strokeWidth={1.6}
                className="text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--panel-accent)
                  group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-(--panel-accent)"
              />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
