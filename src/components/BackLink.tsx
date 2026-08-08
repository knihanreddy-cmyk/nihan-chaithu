import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <nav className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
      <Link
        href="/"
        aria-label="Go home"
        className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-black/55 px-4 font-inter text-[10px] uppercase tracking-[0.24em] text-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:border-[#c9a84c]/60 hover:text-white"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.8}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
        <span>Home</span>
      </Link>
    </nav>
  );
}
