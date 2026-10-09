import { DM_Sans, Instrument_Serif } from "next/font/google";

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

/** Font variables for Home option 4, shared by /home-page-designs/4 and the live homepage. */
export const home4Fonts = [dmSans.variable, instrumentSerif.variable].join(" ");
