import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import Home9 from "./Home9";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--f-bricolage",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--f-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 9 · Big Type Hover Reveal — Chaithrika & Nihan",
  description:
    "Two full-width names set in giant condensed type — hover to reveal a photo card and thin the letters, click to flood the screen in signal orange.",
};

export default function Page() {
  return <Home9 fontClassName={[bricolage.variable, instrumentSerif.variable].join(" ")} />;
}
