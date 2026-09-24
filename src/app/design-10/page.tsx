import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import Design10 from "./Design10";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--f-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--f-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 10 · Ultra Premium Creative — Charming Chaithrika",
  description:
    "An agency-style portfolio for Chaithrika told in colour chapters: a cut-out hero, a pinned horizontal wardrobe gallery, a custom cursor and magnetic buttons.",
};

export default function Page() {
  return <Design10 fontClassName={[bricolage.variable, instrumentSerif.variable].join(" ")} />;
}
