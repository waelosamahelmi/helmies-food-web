import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { UtensilsCrossed, Phone, Mail, MapPin } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const { t } = useLanguage();
  const { config } = useRestaurant();
  
  const IconComponent = (LucideIcons as any)[config.logo.icon] || LucideIcons.UtensilsCrossed;

  return (
    <footer className="bg-stone-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.logo.backgroundColor }}
              >
                <IconComponent className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{config.name}</h3>
                <p className="text-gray-400 text-sm">
                  {t(`${config.address.city}, Suomi`, `${config.address.city}, Finland`)}
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {t(config.about.story, config.about.storyEn)}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {t("Pikanavigaatio", "Quick Links")}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="menu" className="hover:text-white transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="about" className="hover:text-white transition-colors">
                  {t("Meistä", "About")}
                </a>
              </li>
              <li>
                <a href="contact" className="hover:text-white transition-colors">
                  {t("Yhteystiedot", "Contact")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {t("Tietoa", "Information")}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("Käyttöehdot", "Terms & Conditions")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("Tietosuoja", "Privacy Policy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {t("Yhteystiedot", "Contact Info")}
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{config.phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{config.email}</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{config.address.street}, {config.address.postalCode} {config.address.city}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 {config.name}.{" "}
            {t("Kaikki oikeudet pidätetään.", "All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
