import { useLanguage } from "@/lib/language-context";
import { AboutSection } from "@/components/about-section";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNav />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t("Meistä", "About Us")}
          </h1>
          <p className="text-xl md:text-2xl text-red-100">
            {t("Tutustitu Tirvan Kahvilan tarinaan", "Learn about Tirvan Kahvila's story")}
          </p>
        </div>
      </div>

      <AboutSection />
      <Footer />
    </div>
  );
}