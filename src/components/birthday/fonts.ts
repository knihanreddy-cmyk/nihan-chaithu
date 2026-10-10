import { Bodoni_Moda, Montserrat } from "next/font/google";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-bday-display",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-bday-label",
  display: "swap",
});

/** Font variables for the birthday countdown overlay. */
export const birthdayFonts = [bodoni.variable, montserrat.variable].join(" ");
