import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import Design7 from "./Design7";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--f-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--f-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 7 · Modern Neo-Minimal — Charming Chaithrika",
  description:
    "A white, black and signal-orange neo-minimal portfolio with a full-width CHAITHRIKA wordmark, hard rules and scroll-linked geometry.",
};

export default function Page() {
  return <Design7 fontClassName={[archivo.variable, jetbrainsMono.variable].join(" ")} />;
}
