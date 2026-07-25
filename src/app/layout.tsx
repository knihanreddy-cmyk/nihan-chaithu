import type { Metadata } from "next";
import { Playfair_Display, Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charming Chaithrika — Model & Actress",
  description:
    "Fashion-forward and performance-driven — From India Kids Fashion Week Season 11 to Amazon Kids Dress.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${bebas.variable} ${inter.variable}`}
    >
      <body className="bg-black text-white antialiased font-playfair">{children}</body>
    </html>
  );
}
