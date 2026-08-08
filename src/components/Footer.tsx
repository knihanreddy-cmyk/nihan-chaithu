import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#050505] text-white">
      <div className="border-t border-white/10 px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-16 lg:pb-20 lg:pt-28">
        <div className="section-shell">
          <div className="grid gap-10 md:grid-cols-[1fr_0.72fr] md:items-end lg:gap-16">
            <div>
              <p className="mb-5 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c] sm:mb-7">
                Available for bookings
              </p>
              <h2 className="max-w-2xl font-playfair text-[clamp(2.5rem,7vw,5.75rem)] font-semibold italic leading-[1.02] text-white">
                Let&apos;s create something beautiful together.
              </h2>
              <a
                href="mailto:kchaithrikareddy@gmail.com"
                className="group mt-8 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#c9a84c] px-6 font-inter text-[11px] uppercase tracking-[0.2em] text-black transition duration-300 hover:bg-[#f0d77d] sm:w-fit"
              >
                Send a Message
                <ArrowRight
                  size={15}
                  strokeWidth={1.9}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>

            <div className="grid gap-5 border-y border-white/10 py-6 md:border-y-0 md:py-0 md:text-right">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 font-inter text-[9px] uppercase tracking-[0.22em] text-white/32 md:justify-end">
                  <Mail size={13} strokeWidth={1.7} />
                  Email
                </p>
                <a
                  href="mailto:kchaithrikareddy@gmail.com"
                  className="block break-all font-inter text-sm text-white/66 transition-colors duration-300 hover:text-[#c9a84c] sm:break-normal"
                >
                  kchaithrikareddy@gmail.com
                </a>
              </div>

              <div>
                <p className="mb-2 inline-flex items-center gap-2 font-inter text-[9px] uppercase tracking-[0.22em] text-white/32 md:justify-end">
                  <Phone size={13} strokeWidth={1.7} />
                  Phone
                </p>
                <a
                  href="tel:+919652298089"
                  className="block font-inter text-sm text-white/66 transition-colors duration-300 hover:text-[#c9a84c]"
                >
                  +91 96522 98089
                </a>
                <p className="mt-1 font-inter text-sm text-white/46">
                  +91 9951 666 861
                </p>
              </div>

              <div>
                <p className="mb-2 inline-flex items-center gap-2 font-inter text-[9px] uppercase tracking-[0.22em] text-white/32 md:justify-end">
                  <MapPin size={13} strokeWidth={1.7} />
                  Location
                </p>
                <p className="font-inter text-sm leading-relaxed text-white/66">
                  Kompally, Hyderabad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 px-5 py-6 sm:px-8 lg:px-16">
        <div className="section-shell">
          <p className="select-none overflow-hidden font-bebas text-[clamp(3.5rem,13vw,12rem)] leading-none text-white/5">
            CHAITHRIKA
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-inter text-[10px] uppercase tracking-[0.18em] text-white/24">
              &copy; 2026 Chaithrika. All rights reserved.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2.5 font-inter text-[11px] uppercase tracking-[0.18em] text-white/42 transition-colors duration-300 hover:text-[#c9a84c]"
            >
              <FaInstagram
                size={15}
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
