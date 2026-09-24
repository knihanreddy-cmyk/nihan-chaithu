import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import Design4 from "./Design4";

const dmSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-dmsans",
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
  title: "Design 4 · Modern Glassmorphism — Charming Chaithrika",
  description:
    "Frosted-glass panels floating over a drifting rose, teal and mint colour field, with serif display type and pointer-parallax hero chips.",
};

export default function Page() {
  return <Design4 fontClassName={[dmSans.variable, instrumentSerif.variable].join(" ")} />;
}
