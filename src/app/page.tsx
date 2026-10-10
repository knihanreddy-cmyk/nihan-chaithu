import type { Metadata } from "next";
import BirthdayCountdown from "@/components/birthday/BirthdayCountdown";
import Home4 from "./home-page-designs/4/Home4";
import { home4Fonts } from "./home-page-designs/4/fonts";

export const metadata: Metadata = {
  title: "Chaithrika & Nihan — Portfolio",
  description:
    "Choose a portfolio: Chaithrika, model and actress, or her brother Nihan. Bookings are managed by their parents.",
};

export default function Home() {
  return (
    <BirthdayCountdown>
      <Home4 fontClassName={home4Fonts} preview={false} />
    </BirthdayCountdown>
  );
}
