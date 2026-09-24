import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Syne } from "next/font/google";
import Design9 from "./Design9";

const syne = Syne({
  subsets: ["latin"],
  variable: "--f-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--f-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--f-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 9 · Futuristic Premium — Charming Chaithrika",
  description:
    "A dark, HUD-styled portfolio with a spotlit runway cutout, spinning gradient-border cards, 3D tilt and a filterable frame index.",
};

export default function Page() {
  return (
    <Design9
      fontClassName={[syne.variable, manrope.variable, jetbrainsMono.variable].join(" ")}
    />
  );
}
