import type { Metadata } from "next";
import Design10 from "./Design10";
import { design10Fonts } from "./fonts";

export const metadata: Metadata = {
  title: "Design 10 · Ultra Premium Creative — Charming Chaithrika",
  description:
    "An agency-style portfolio for Chaithrika told in colour chapters: a cut-out hero, a pinned horizontal wardrobe gallery, a custom cursor and magnetic buttons.",
};

export default function Page() {
  return <Design10 fontClassName={design10Fonts} />;
}
