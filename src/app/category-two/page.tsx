import Link from "next/link";
import Image from "next/image";

export default function ActingPage() {
  return (
    <main className="animate-page-enter relative bg-black min-h-svh flex flex-col items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/featured_works/d67b374abf8d99540107eef87e4b9f71.jpg"
          alt="Acting"
          fill
          priority
          className="object-cover object-top opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/80" />
      </div>

      {/* Back button */}
      <nav className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="font-inter text-white/55 text-[10px] uppercase tracking-[0.28em]
            hover:text-white transition-colors duration-300
            flex items-center gap-2
            bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full
            border border-white/10 hover:border-white/25"
        >
          ← Home
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 text-center px-6 text-white">
        <p className="font-inter text-[#c9a84c] text-[10px] uppercase tracking-[0.42em] mb-5">
          Coming Soon
        </p>
        <h1 className="font-bebas text-white leading-none tracking-[-0.01em] mb-6
          text-[clamp(5rem,14vw,11rem)]">
          Acting
        </h1>
        <div className="w-12 h-px bg-[#c9a84c] mx-auto mb-6" />
        <p className="font-inter text-white/45 text-[11px] sm:text-sm uppercase tracking-[0.25em]">
          Screen · Stage · Performance
        </p>
      </div>

    </main>
  );
}
