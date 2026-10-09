import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

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

/** Font variables for Design 10, shared by /design-10 and the live /chaithrika page. */
export const design10Fonts = [bricolage.variable, instrumentSerif.variable].join(" ");
