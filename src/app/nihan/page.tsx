import type { Metadata } from "next";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = {
  title: "Nihan - Portfolio",
  description: "Nihan's portfolio is on its way. Bookings are managed by his parents.",
};

export default function NihanPage() {
  return (
    <main className="animate-page-enter relative grid min-h-svh place-items-center overflow-hidden bg-[#050505] px-5 py-24 text-white">
      <BackLink />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-bebas text-[clamp(18rem,62vw,48rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,168,76,0.18)]"
      >
        N
      </span>

      <div className="relative max-w-xl text-center">
        <p className="mb-5 font-inter text-[10px] uppercase tracking-[0.32em] text-[#c9a84c]">
          Portfolio
        </p>
        <h1 className="font-bebas text-[clamp(5rem,18vw,11rem)] leading-[0.82]">
          Nihan
        </h1>
        <p className="mt-6 font-playfair text-2xl italic text-white/80 sm:text-3xl">
          New faces, fresh frames.
        </p>
        <p className="mx-auto mt-6 max-w-md font-inter text-sm leading-7 text-white/55">
          Nihan&apos;s portraits and work are being prepared. Check back soon,
          or get in touch with his parents for bookings.
        </p>
      </div>
    </main>
  );
}
