import type { Metadata } from "next";
import { Archivo_Narrow, Fraunces, Newsreader } from "next/font/google";
import Design5 from "./Design5";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--f-disp",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-text",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--f-cap",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 5 · Editorial Magazine — Charming Chaithrika",
  description:
    "A fashion-magazine portfolio for Chaithrika: masthead cover, contents page, feature spreads, a lookbook and a bookings page on warm newsprint.",
};

export default function Page() {
  return <Design5 fontClassName={[fraunces.variable, newsreader.variable, archivoNarrow.variable].join(" ")} />;
}
