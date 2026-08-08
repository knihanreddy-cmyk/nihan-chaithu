import ActingBioSection from "@/components/acting/ActingBioSection";
import ActingEditorialGallerySection from "@/components/acting/ActingEditorialGallerySection";
import ActingFeaturedWorkSection from "@/components/acting/ActingFeaturedWorkSection";
import ActingGallerySection from "@/components/acting/ActingGallerySection";
import ActingHeroSection from "@/components/acting/ActingHeroSection";
import ActingQuoteSection from "@/components/acting/ActingQuoteSection";
import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";

export default function ActingPage() {
  return (
    <main className="animate-page-enter bg-[#050505]">
      <BackLink />
      <ActingHeroSection />
      <ActingBioSection />
      <ActingEditorialGallerySection />
      <ActingFeaturedWorkSection />
      <ActingQuoteSection />
      <ActingGallerySection />
      <Footer />
    </main>
  );
}
