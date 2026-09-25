import type { Metadata } from "next";
import PortfolioHero from "@/components/portfolio/PortfolioHero";

export const metadata: Metadata = {
  title: "Chaithrika - Model & Actress",
  description:
    "Fashion-forward and performance-driven - from India Kids Fashion Week Season 11 to Amazon Kids Dress.",
};

export default function ChaithrikaPage() {
  return <PortfolioHero />;
}
