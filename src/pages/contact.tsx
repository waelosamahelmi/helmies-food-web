import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import ContactSection from "@/components/contact-section";
import { UniversalHeader } from "@/components/universal-header";
import { Footer } from "@/components/footer";

export default function Contact() {
  const { t } = useLanguage();
  const { config } = useRestaurant();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <UniversalHeader />
      
      {/* Page Header */}
      <div 
        className="text-white py-16"
        style={{ 
          background: `linear-gradient(to right, ${config.theme.primary}, ${config.theme.accent})` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t("Yhteystiedot", "Contact")}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {t("Ota yhteyttä tai tule käymään", "Get in touch or visit us")}
          </p>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
}