import { Fraunces, Manrope } from "next/font/google";

/* Ivory Editorial: Fraunces for display, Manrope for text. */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-admin-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--f-admin-text",
  display: "swap",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`admin ${fraunces.variable} ${manrope.variable} min-h-svh bg-[#F5F0E8] font-manrope text-[#1E1B18] antialiased`}>
      {children}
    </div>
  );
}
