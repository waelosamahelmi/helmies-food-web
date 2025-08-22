import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Heart,
  ChefHat,
  Truck,
  Coffee,
  Facebook
} from "lucide-react";

export function AboutSection() {
  const { t } = useLanguage();
  const { config } = useRestaurant();

  return (
    <section className="py-16 bg-white dark:bg-stone-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main About Content */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {t(`Meistä ${config.name}`, `About ${config.nameEn}`)}
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 dark:text-gray-300">
            <p>
              {t(config.about.story, config.about.storyEn)}
            </p>
            <p className="text-xl font-semibold" style={{ color: config.theme.primary }}>
              {config.services.hasDelivery && t("Nopea ja luotettava toimituspalvelu!", "Fast and reliable delivery service!")}
            </p>
            <p>
              {t(config.about.mission, config.about.missionEn)}
            </p>
          </div>
        </div>

        {/* Our Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {config.about.specialties.map((specialty, index) => {
            const IconComponent = (LucideIcons as any)[specialty.icon] || LucideIcons.Star;
            const colors = [config.theme.primary, config.theme.secondary, config.theme.accent, config.theme.success];
            const color = colors[index % colors.length];
            
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ 
                      backgroundColor: `${color}20`,
                      color: color 
                    }}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {t(specialty.title, specialty.titleEn)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t(specialty.description, specialty.descriptionEn)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission Statement */}
        <div 
          className="rounded-lg p-8 mb-12"
          style={{ 
            background: `linear-gradient(to right, ${config.theme.primary}10, ${config.theme.secondary}10)` 
          }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("Tavoitteemme", "Our Goal")}
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {t(config.about.mission, config.about.missionEn)}
            </p>
            <div className="mt-6">
              <Badge variant="outline" className="text-lg px-6 py-2">
                {t("Pizza, Hampurilaiset, Kebab ja paljon muuta", "Pizza, Burgers, Kebab and much more")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Truck className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">
                  {t(`Ruoka toimitus ${config.address.city}`, `Food Delivery ${config.address.city}`)}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t(
                  "Etsitkö ruokatoimitusta lähistöltäsi? Kaikilla ei ole taitoa tai aikaa valmistaa maukasta ruokaa.",
                  "Looking for food delivery nearby? Not everyone has the skill or time to prepare delicious food."
                )}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t(`Kun haluat kuninkaallista kohtelua, on ${config.name} täydellinen vaihtoehto.`, `When you want royal treatment, ${config.nameEn} is the perfect choice.`)}
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {t(
                  'Valitse vain "Toimitus" kassalla, ja ruoka toimitetaan kotiovellesi.',
                  'Just select "Delivery" at checkout, and food will be delivered to your door.'
                )}
              </p>
              
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  {t("Toimituskulut", "Delivery Fees")}
                </h4>
                <div className="space-y-1 text-sm">
                  {config.delivery.zones.map((zone, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {index === 0 
                          ? t(`Kuljetusalue 0 - ${zone.maxDistance}km`, `Delivery area 0 - ${zone.maxDistance}km`)
                          : t(`Kuljetusalue yli ${config.delivery.zones[index-1].maxDistance}km`, `Delivery area over ${config.delivery.zones[index-1].maxDistance}km`)
                        }
                      </span>
                      <span className="font-medium">
                        {zone.fee.toFixed(2)} €
                        {zone.minimumOrder && ` (${t("Min.", "Min.")} ${zone.minimumOrder.toFixed(2)} €)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">
                  {t("Yhteydenotto", "Contact Information")}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{config.address.street}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {config.address.postalCode} {config.address.city}, {config.address.country}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <a href={`tel:${config.phone}`} className="font-medium text-blue-600 hover:underline">
                    {config.phone}
                  </a>
                </div>
                
                {config.facebook && (
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-5 h-5 text-gray-500" />
                    <a 
                      href={config.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Facebook - {config.name}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-stone-700 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {t("Aukioloajat", "Opening Hours")}
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{t("Maanantai - Sunnuntai", "Monday - Sunday")}</span>
                    <span>{config.hours.general.monday.open} - {config.hours.general.monday.close}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}