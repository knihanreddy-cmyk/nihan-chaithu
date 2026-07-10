import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import QuoteSection from "@/components/QuoteSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import EditorialGallerySection from "@/components/EditorialGallerySection"
export default function Home() {
  return (
    <main>
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
