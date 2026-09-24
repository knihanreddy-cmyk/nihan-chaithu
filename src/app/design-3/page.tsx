import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Design3 from "./Design3";

const geist = Geist({
  subsets: ["latin"],
  variable: "--f-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 3 · Apple-Inspired Minimal — Charming Chaithrika",
  description:
    "A product-launch style portfolio for Chaithrika, with crisp type, bento tiles and a hero photo that grows as you scroll.",
};

export default function Page() {
  return <Design3 fontClassName={[geist.variable, geistMono.variable].join(" ")} />;
}
