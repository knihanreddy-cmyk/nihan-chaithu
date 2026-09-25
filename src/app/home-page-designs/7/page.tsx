import type { Metadata } from "next";
import { Cormorant_Garamond, Italiana, Mulish } from "next/font/google";
import Home7 from "./Home7";

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-italiana",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-mulish",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "italic",
  variable: "--f-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 7 · Soft Arches — Chaithrika & Nihan",
  description:
    "Two soft linen arches, blush for Chaithrika and sage for Nihan: choose one and its arch opens out to fill the screen as the portfolio loads.",
};

export default function Page() {
  return <Home7 fontClassName={[italiana.variable, mulish.variable, cormorant.variable].join(" ")} />;
}
