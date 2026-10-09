import type { Metadata } from "next";
import Home4 from "./Home4";
import { home4Fonts } from "./fonts";

export const metadata: Metadata = {
  title: "Home option 4 · Glass Portals — Chaithrika & Nihan",
  description:
    "A soft living colour field with two frosted-glass portals — one for Chaithrika, one for Nihan — that dissolve into a full-screen takeover as you enter.",
};

export default function Page() {
  return <Home4 fontClassName={home4Fonts} />;
}
