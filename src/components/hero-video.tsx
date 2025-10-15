import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Play, Phone } from "lucide-react";
import { Link } from "wouter";

export function HeroVideo() {
  const { t } = useLanguage();
  const { config } = useRestaurant();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={config.hero.backgroundImage}
        >
          {config.hero.videoUrl && (
            <source
              src={config.hero.videoUrl}
              type="video/mp4"
            />
          )}
          {/* Fallback for browsers that don't support video */}
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {t(config.name, config.nameEn)}
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl mb-4 opacity-90 font-light">
          {t(config.tagline, config.taglineEn)}
        </p>
        
        <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
          {t(config.description, config.descriptionEn)}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/menu">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 border-none"
              style={{ 
                backgroundColor: config.theme.primary,
                color: 'white'
              }}
            >
              <UtensilsCrossed className="w-6 h-6 mr-3" />
              {t("Selaa menua", "Browse Menu")}
            </Button>
          </Link>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            asChild
          >
            <a href={`tel:${config.phone}`}>
              <Phone className="w-6 h-6 mr-3" />
              {t("Soita meille", "Call Us")}
            </a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`grid grid-cols-1 md:grid-cols-${config.hero.features.length} gap-4 text-center text-white text-sm`}>
            {config.hero.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: feature.color }}
                ></div>
                <span>{t(feature.title, feature.titleEn)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}