import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Design1 from "./Design1";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
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
  title: "Design 1 · Luxury Minimal — Charming Chaithrika",
  description:
    "An ivory lookbook portfolio for Chaithrika, with light Cormorant display type and photographs that carry the colour.",
};

export default function Page() {
  return <Design1 fontClassName={[cormorant.variable, manrope.variable].join(" ")} />;
}
