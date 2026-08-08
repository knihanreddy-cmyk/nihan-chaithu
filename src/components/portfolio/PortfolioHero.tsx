"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import PortfolioCard from "./PortfolioCard";
import PortfolioHeader from "./PortfolioHeader";
import PortfolioNavigation from "./PortfolioNavigation";
import { portfolioItems } from "./portfolioData";

const EXPANDED_SHARE = 68;
const CONTRACTED_SHARE = 32;
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(callback: () => void) {
  const mq = window.matchMedia(FINE_POINTER_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

export default function PortfolioHero() {
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cursorActive, setCursorActive] = useState(false);
  const pointerFine = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );

  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  function moveCursor(x: number, y: number) {
    pendingPos.current = { x, y };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (cursorRef.current) {
        const { x: px, y: py } = pendingPos.current;
        cursorRef.current.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = null;
    });
  }

  function widthFor(index: number) {
    if (activeIndex === null) return portfolioItems[index].share;
    return activeIndex === index ? EXPANDED_SHARE : CONTRACTED_SHARE;
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050505] text-white">
      {/* Single document-level heading; each category below is a visual h2 */}
      <h1 className="sr-only">Charming Chaithrika — Modeling &amp; Acting Portfolio</h1>

      <PortfolioHeader loaded={loaded} />

      <div className="flex min-h-svh flex-col divide-y divide-white/10 md:flex-row md:divide-x md:divide-y-0">
        {portfolioItems.map((item, index) => (
          <PortfolioCard
            key={item.href}
            item={item}
            index={index}
            widthPercent={widthFor(index)}
            active={activeIndex === index}
            dimmed={activeIndex !== null && activeIndex !== index}
            loaded={loaded}
            onMouseEnter={() => {
              setActiveIndex(index);
              setCursorActive(true);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
              setCursorActive(false);
            }}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            onMouseMove={(event: MouseEvent<HTMLAnchorElement>) => {
              moveCursor(event.clientX, event.clientY);
            }}
          />
        ))}
      </div>

      <PortfolioNavigation total={portfolioItems.length} activeIndex={activeIndex} loaded={loaded} />

      {/* Vertical brand signature, left edge — a quiet echo of the "Charming Chaithrika"
          wordmark in the header (same serif, same italic), not a UI label, so it reads
          as an engraved detail rather than a nav item. Not content: hidden from assistive
          tech. pointer-events-none so it never steals clicks/taps from the Modeling panel
          it sits against; its "hover" brightening is tied to that panel's own active state
          instead of its own :hover, since a pointer-events-none element can't receive one. */}
      <div
        className="pointer-events-none absolute left-5 top-1/2 z-30 hidden -translate-y-1/2 md:block"
        aria-hidden="true"
      >
        <div
          className={`flex flex-col items-center gap-5 transition-all duration-1000 delay-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
        >
          <span className="h-8 w-px bg-white/12" />
          <div
            className={`flex flex-col items-center gap-1.5 font-playfair italic
              text-[13px] tracking-[0.02em] transition-colors duration-500
              ${activeIndex === 0 ? "text-white/50" : "text-white/30"}`}
          >
            {"CHAITHRIKA".split("").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
          <span className="h-8 w-px bg-white/12" />
        </div>
      </div>

      {/* Decorative editorial edge mark — not content, hidden from assistive tech */}
      <div
        className="pointer-events-none absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <span
          className="font-inter text-[10px] uppercase tracking-[0.5em] text-white/25"
          style={{ writingMode: "vertical-rl" }}
        >
          Chaithrika — 2026
        </span>
      </div>

      {/* Minimal custom cursor: desktop fine-pointer only, purely decorative */}
      {pointerFine && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className={`pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center gap-1
            rounded-full border transition-[width,height,border-color] duration-300 ease-out
            ${
              cursorActive
                ? "h-24 w-24 border-white/70"
                : "h-2 w-2 border-transparent bg-white/80"
            }`}
        >
          <span
            className={`font-inter text-[9px] uppercase tracking-[0.2em] text-white transition-opacity duration-200 ${
              cursorActive ? "opacity-100 delay-150" : "opacity-0"
            }`}
          >
            Explore
          </span>
          <ArrowUpRight
            size={11}
            strokeWidth={2}
            className={`text-white transition-opacity duration-200 ${
              cursorActive ? "opacity-100 delay-150" : "opacity-0"
            }`}
          />
        </div>
      )}
    </main>
  );
}
