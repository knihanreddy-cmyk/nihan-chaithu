export default function PortfolioHeader({ loaded }: { loaded: boolean }) {
  return (
    <header
      className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between
        px-5 py-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        sm:px-8 sm:py-8 lg:px-14
        ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
    >
      <p className="font-playfair text-lg italic tracking-wide text-white sm:text-xl lg:text-2xl">
        Charming Chaithrika
      </p>
      <p className="font-inter text-[10px] uppercase tracking-[0.36em] text-white/50">
        Portfolio
      </p>
    </header>
  );
}
