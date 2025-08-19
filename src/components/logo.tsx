import { useLanguage } from "@/lib/language-context";
import { useRestaurant } from "@/lib/restaurant-context";
import * as LucideIcons from "lucide-react";

export function Logo({ className = "h-8" }: { className?: string }) {
  const { config } = useRestaurant();
  
  // Debug logging
  console.log('Logo config:', config.logo);
  
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[config.logo.icon] || LucideIcons.UtensilsCrossed;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: config.logo.backgroundColor }}
      >
        {config.logo.imageUrl ? (
          <img 
            src={config.logo.imageUrl} 
            alt={config.name} 
            className="w-full h-full object-cover"
            onError={(e) => console.error('Logo image failed to load:', e)}
            onLoad={() => console.log('Logo image loaded successfully')}
          />
        ) : (
          <IconComponent className="w-6 h-6 text-white" />
        )}
      </div>
      
      {config.logo.showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {config.name}
          </span>
        </div>
      )}
    </div>
  );
}