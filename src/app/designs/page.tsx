import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { designs } from "@/components/designs/designList";

export const metadata: Metadata = {
  title: "Design Options — Charming Chaithrika",
  description:
    "Ten homepage design directions for Chaithrika's portfolio, from luxury minimal to agency-style creative.",
};

export default function DesignsIndex() {
  return (
    <main className="min-h-svh bg-[#050505] px-4 pb-24 pt-14 text-white sm:px-8 lg:px-16 lg:pt-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c]">
              Charming Chaithrika
            </p>
            <h1 className="font-bebas text-[clamp(3.5rem,10vw,8rem)] leading-[0.85]">
              Design Options
            </h1>
          </div>
          <p className="max-w-sm font-inter text-sm leading-7 text-white/60">
            Ten directions for the same portfolio, built with the same content
            and photos. Open each one, check it on desktop and phone, and pick
            the one that feels most like her.
          </p>
        </header>

        <ol className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {designs.map((design) => (
            <li key={design.number}>
              <Link
                href={design.href}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  <Image
                    src={design.cover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    className="object-cover object-[50%_22%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex gap-1.5 p-3">
                    {design.swatch.map((color) => (
                      <span
                        key={color}
                        className="h-3 w-3 rounded-full border border-white/40"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-bebas text-2xl leading-none text-[#c9a84c]">
                    {String(design.number).padStart(2, "0")}
                  </span>
                  <h2 className="font-playfair text-xl leading-tight transition-colors group-hover:text-[#e9d58b]">
                    {design.name}
                  </h2>
                </div>
                <p className="mt-2 font-inter text-[13px] leading-6 text-white/55">
                  {design.summary}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
