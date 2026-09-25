import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import Home2 from "./Home2";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--f-bodoni",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home option 2 · Spotlight Stage — Chaithrika & Nihan",
  description:
    "A dark theatre stage with two spotlights: choose Chaithrika or Nihan and the chosen beam floods the screen as her or his portfolio opens.",
};

export default function Page() {
  return <Home2 fontClassName={[bodoni.variable, hanken.variable].join(" ")} />;
}
