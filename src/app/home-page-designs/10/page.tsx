import type { Metadata } from "next";
import { Caveat, Courier_Prime, Playfair_Display } from "next/font/google";
import Home10 from "./Home10";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--f-hand",
  display: "swap",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--f-type",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--f-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 10 · Polaroid Table — Chaithrika & Nihan",
  description:
    "Polaroids tossed on a linen table — push them around, then pick one up to open Chaithrika's or Nihan's portfolio.",
};

export default function Page() {
  return <Home10 fontClassName={[caveat.variable, courierPrime.variable, playfair.variable].join(" ")} />;
}
