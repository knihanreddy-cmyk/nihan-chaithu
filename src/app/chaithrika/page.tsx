import type { Metadata } from "next";
import Design10 from "../design-10/Design10";
import { design10Fonts } from "../design-10/fonts";

export const metadata: Metadata = {
  title: "Chaithrika - Model & Actress",
  description:
    "Fashion-forward and performance-driven - from India Kids Fashion Week Season 11 to Amazon Kids Dress.",
};

export default function ChaithrikaPage() {
  return <Design10 fontClassName={design10Fonts} preview={false} />;
}
