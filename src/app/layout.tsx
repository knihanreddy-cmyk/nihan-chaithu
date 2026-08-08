import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
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
  title: "Charming Chaithrika - Model & Actress",
  description:
    "Fashion-forward and performance-driven - from India Kids Fashion Week Season 11 to Amazon Kids Dress.",
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
      <body className="min-h-svh bg-[#050505] text-white antialiased font-playfair">
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
}
