import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import EditorialGallerySection from "@/components/EditorialGallerySection";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import QuoteSection from "@/components/QuoteSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

export default function ModelingPage() {
  return (
    <main className="animate-page-enter">
      {/* Back button — fixed, subtle */}
      <nav className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="font-inter text-white/55 text-[10px] uppercase tracking-[0.28em]
            hover:text-white transition-colors duration-300
            flex items-center gap-2
            bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full
            border border-white/10 hover:border-white/25"
        >
          ← Home
        </Link>
      </nav>

      <HeroSection />
      <BioSection />
      <EditorialGallerySection />
      <FeaturedWorkSection />
      <QuoteSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
