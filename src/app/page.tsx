import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import QuoteSection from "@/components/QuoteSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BioSection />
      <FeaturedWorkSection />
      <QuoteSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
