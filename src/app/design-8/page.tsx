import type { Metadata } from "next";
import { Cormorant_Garamond, Italiana, Mulish } from "next/font/google";
import Design8 from "./Design8";

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-italiana",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "italic",
  variable: "--f-cormorant",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--f-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 8 · Premium Soft Aesthetic — Charming Chaithrika",
  description:
    "A calm linen-and-mocha portfolio for Chaithrika, with arch-topped photo frames, soft shadows and gentle motion.",
};

export default function Page() {
  return (
    <Design8
      fontClassName={[italiana.variable, cormorant.variable, mulish.variable].join(" ")}
    />
  );
}
