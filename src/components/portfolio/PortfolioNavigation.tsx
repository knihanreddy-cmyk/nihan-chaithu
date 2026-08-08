export default function PortfolioNavigation({
  total,
  activeIndex,
  loaded,
}: {
  total: number;
  activeIndex: number | null;
  loaded: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-6 z-40 hidden items-center justify-center gap-3
        font-inter text-[10px] uppercase tracking-[0.32em] text-white/40
        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex
        ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
      style={{ transitionDelay: loaded ? "500ms" : "0ms" }}
      aria-hidden="true"
    >
      {portfolioIndexes(total).map(({ index, isLast }) => (
        <span key={index} className="flex items-center gap-3">
          <span
            className={`transition-colors duration-500 ${
              activeIndex === index ? "text-white" : ""
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {!isLast && (
            <span
              className={`h-px bg-white/20 transition-all duration-500 ${
                activeIndex !== null ? "w-5" : "w-9"
              }`}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function portfolioIndexes(total: number) {
  return Array.from({ length: total }, (_, index) => ({
    index,
    isLast: index === total - 1,
  }));
}
