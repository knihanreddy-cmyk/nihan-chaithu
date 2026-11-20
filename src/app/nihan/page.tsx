import type { Metadata } from "next";
import { Caveat, Karla, Zilla_Slab } from "next/font/google";
import NihanJournal from "./NihanJournal";
import { getContent } from "@/lib/cms/content";

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--f-slab",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--f-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--f-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nihan Reddy — Portfolio",
  description:
    "Field notes from growing up: Nihan Reddy's looks, adventures and little moments, 2015–2026. Bookings are managed by his parents.",
};

export default async function NihanPage() {
  const content = await getContent("nihan");
  return (
    <NihanJournal
      fontClassName={[zillaSlab.variable, karla.variable, caveat.variable].join(" ")}
      content={content}
    />
  );
}
