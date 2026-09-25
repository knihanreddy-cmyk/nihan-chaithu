import type { Metadata } from "next";
import { DM_Sans, Fredoka } from "next/font/google";
import Home8 from "./Home8";

const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--f-dmsans",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--f-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 8 · Character Select — Chaithrika & Nihan",
  description:
    "A playful game-style player-select gateway: move the glowing ring between Chaithrika and Nihan with the arrow keys or a tap, then press Enter to open their portfolio.",
};

export default function Page() {
  return <Home8 fontClassName={[dmSans.variable, fredoka.variable].join(" ")} />;
}
