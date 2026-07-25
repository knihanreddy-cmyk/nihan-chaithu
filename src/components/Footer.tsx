import { FaInstagram } from "react-icons/fa6";

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
    <path
      d="M1 6h10M6 1l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white overflow-hidden">

      {/* CTA section */}
      <div className="border-t border-white/10 px-6 lg:px-16 pt-20 lg:pt-28 pb-16 lg:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 lg:gap-20">

            {/* Left — heading + CTA */}
            <div className="lg:max-w-lg">
              <p className="font-inter text-[#c9a84c] text-[10px] uppercase tracking-[0.4em] mb-7">
                — Available for bookings
              </p>
              <h2 className="italic font-semibold leading-[1.05]
                text-[clamp(2rem,4.5vw,4.2rem)] mb-10">
                Let&rsquo;s create<br />
                something<br />
                beautiful together.
              </h2>
              <a
                href="mailto:kchaithrikareddy@gmail.com"
                className="group inline-flex items-center gap-3
                  font-inter text-[11px] uppercase tracking-[0.28em]
                  border border-[#c9a84c] text-[#c9a84c]
                  px-8 py-4 rounded-full
                  hover:bg-[#c9a84c] hover:text-black
                  transition-all duration-300"
              >
                Send a Message
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight />
                </span>
              </a>
            </div>

            {/* Right — contact details */}
            <div className="flex flex-col gap-7 lg:text-right">
              <div>
                <p className="font-inter text-white/30 text-[9px] uppercase tracking-[0.3em] mb-1.5">
                  Email
                </p>
                <a
                  href="mailto:kchaithrikareddy@gmail.com"
                  className="font-inter text-white/60 text-sm hover:text-[#c9a84c] transition-colors duration-300"
                >
                  kchaithrikareddy@gmail.com
                </a>
              </div>
              <div>
                <p className="font-inter text-white/30 text-[9px] uppercase tracking-[0.3em] mb-1.5">
                  Phone
                </p>
                <a
                  href="tel:+919652298089"
                  className="font-inter text-white/60 text-sm hover:text-[#c9a84c] transition-colors duration-300 block"
                >
                  +91 96522 98089
                </a>
                <p className="font-inter text-white/40 text-[12px] mt-0.5">
                  +91 9951 666 861
                </p>
              </div>
              <div>
                <p className="font-inter text-white/30 text-[9px] uppercase tracking-[0.3em] mb-1.5">
                  Location
                </p>
                <p className="font-inter text-white/60 text-sm leading-relaxed">
                  Kompally, Hyderabad.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Brand strip */}
      <div className="border-t border-white/6 px-6 lg:px-16 pt-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <p className="font-bebas select-none leading-none
            text-white/5 text-[clamp(4rem,13vw,12rem)] mb-4">
            CHAITHRIKA
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-inter text-white/20 text-[10px] uppercase tracking-[0.24em]">
              &copy; 2025 Chaithrika. All rights reserved.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5
                font-inter text-white/35 text-[11px] uppercase tracking-[0.24em]
                hover:text-[#c9a84c] transition-colors duration-300"
            >
              <FaInstagram
                size={14}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Instagram
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
