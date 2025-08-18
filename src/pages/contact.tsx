import { useLanguage } from "@/lib/language-context";
import { ContactSection } from "@/components/contact-section";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNav />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t("Yhteystiedot", "Contact")}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            {t("Ota yhteyttä tai tule käymään", "Get in touch or visit us")}
          </p>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
}