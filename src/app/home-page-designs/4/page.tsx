import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import Home4 from "./Home4";

const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--f-dm-sans",
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
  title: "Home option 4 · Glass Portals — Chaithrika & Nihan",
  description:
    "A soft living colour field with two frosted-glass portals — one for Chaithrika, one for Nihan — that dissolve into a full-screen takeover as you enter.",
};

export default function Page() {
  return <Home4 fontClassName={[dmSans.variable, instrumentSerif.variable].join(" ")} />;
}
