import type { Metadata } from "next";
import { Archivo_Narrow, Fraunces } from "next/font/google";
import Home5 from "./Home5";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--f-fraunces",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--f-narrow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 5 · Double Cover — Chaithrika & Nihan",
  description:
    "Two magazine covers on a newsstand ledge — pick up an issue and the cover turns open into Chaithrika's or Nihan's portfolio.",
};

export default function Page() {
  return <Home5 fontClassName={[fraunces.variable, archivoNarrow.variable].join(" ")} />;
}
