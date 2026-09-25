import type { Metadata } from "next";
import { Anton, DM_Mono } from "next/font/google";
import Home6 from "./Home6";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-anton",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 6 · Diagonal Split — Chaithrika & Nihan",
  description:
    "A bold pink-and-navy gateway split by a leaning diagonal, with slammed Anton names and a runway cut-out breaking across the seam.",
};

export default function Page() {
  return <Home6 fontClassName={[anton.variable, dmMono.variable].join(" ")} />;
}
