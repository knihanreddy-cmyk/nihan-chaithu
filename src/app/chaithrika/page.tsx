import type { Metadata } from "next";
import Design10 from "../design-10/Design10";
import { design10Fonts } from "../design-10/fonts";
import { getContent } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Chaithrika - Model & Actress",
  description:
    "Fashion-forward and performance-driven - from India Kids Fashion Week Season 11 to Amazon Kids Dress.",
};

export default async function ChaithrikaPage() {
  const content = await getContent("chaithrika");
  return <Design10 fontClassName={design10Fonts} preview={false} content={content} />;
}
