import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { HeroSection } from "@/components/layout/HeroSection";
import { BenefitsBar } from "@/components/layout/BenefitsBar";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <BenefitsBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12">
        {/* Destacados */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">⭐ Los más elegidos</h2>
          <FeaturedProducts />
        </div>
      </div>
    </div>
  );
}
