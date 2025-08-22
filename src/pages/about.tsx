import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { AboutSection } from "@/components/about-section";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/footer";

export default function About() {
  const { t } = useLanguage();
  const { config } = useRestaurant();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <UniversalHeader />
      
      {/* Page Header */}
      <div 
        className="text-white py-16"
        style={{ 
          background: `linear-gradient(to right, ${config.theme.primary}, ${config.theme.secondary})` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t("Meistä", "About Us")}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {t(`Tutustu ${config.name}n tarinaan`, `Learn about ${config.nameEn}'s story`)}
          </p>
        </div>
      </div>

      <AboutSection />
      <Footer />
    </div>
  );
}