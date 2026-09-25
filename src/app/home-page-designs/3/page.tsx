import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Home3 from "./Home3";

const geist = Geist({
  subsets: ["latin"],
  variable: "--f-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 3 · Clean Cards — Chaithrika & Nihan",
  description:
    "A bright, minimal gateway with two tilting glass-label cards that expand to fill the screen as you enter Chaithrika's or Nihan's portfolio.",
};

export default function Page() {
  return <Home3 fontClassName={geist.variable} />;
}
