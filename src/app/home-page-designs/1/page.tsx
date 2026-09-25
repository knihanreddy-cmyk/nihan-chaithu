import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Home1 from "./Home1";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--f-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--f-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 1 · Split Screen Expand — Chaithrika & Nihan",
  description:
    "An ivory split-screen gateway: two full-height portrait panels for Chaithrika and Nihan that widen on hover and expand into the chosen portfolio.",
};

export default function Page() {
  return <Home1 fontClassName={[cormorant.variable, manrope.variable].join(" ")} />;
}
