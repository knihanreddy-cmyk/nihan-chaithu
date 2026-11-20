import type { Metadata } from "next";
import Home4 from "./home-page-designs/4/Home4";
import { home4Fonts } from "./home-page-designs/4/fonts";
import { getContent } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Chaithrika & Nihan — Portfolio",
  description:
    "Choose a portfolio: Chaithrika, model and actress, or her brother Nihan. Bookings are managed by their parents.",
};

export default async function Home() {
  const content = await getContent("home");
  return <Home4 fontClassName={home4Fonts} preview={false} content={content} />;
}
