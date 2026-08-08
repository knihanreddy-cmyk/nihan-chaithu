import BackLink from "@/components/BackLink";
import BioSection from "@/components/BioSection";
import EditorialGallerySection from "@/components/EditorialGallerySection";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";

export default function ModelingPage() {
  return (
    <main className="animate-page-enter bg-[#050505]">
      <BackLink />
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
