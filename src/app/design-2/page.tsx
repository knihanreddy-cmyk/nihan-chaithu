import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import Design2 from "./Design2";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-bodoni",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--f-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 2 · Dark Luxury — Charming Chaithrika",
  description:
    "A black and antique-gold portfolio with a cinematic title-card hero, Bodoni italics and softly glowing work cards.",
};

export default function Page() {
  return <Design2 fontClassName={[bodoni.variable, hanken.variable].join(" ")} />;
}
