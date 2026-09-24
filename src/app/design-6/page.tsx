import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Libre_Baskerville } from "next/font/google";
import Design6 from "./Design6";

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--f-baskerville",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--f-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design 6 · Luxury Corporate — Charming Chaithrika",
  description:
    "A navy and brass talent profile for Chaithrika, with a credentials sheet, safeguarding standards and a clear booking process.",
};

export default function Page() {
  return (
    <Design6 fontClassName={[baskerville.variable, plexSans.variable, plexMono.variable].join(" ")} />
  );
}
