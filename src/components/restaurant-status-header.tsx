import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Clock, Store, ShoppingCart } from "lucide-react";
import { getRestaurantStatus } from "@/lib/business-hours";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";

export function RestaurantStatusHeader() {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { config, isOpen: dbIsOpen } = useRestaurantSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Don't render if no config available
  if (!config) {
    return null;
  }

  const status = getRestaurantStatus(config, currentTime);
  const { isOpen: restaurantOpen, isOrderingOpen, nextOpening, nextOrdering } = status;

  // Use database override if available, otherwise use calculated status
  const effectiveIsOpen = dbIsOpen !== undefined ? dbIsOpen : restaurantOpen;

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-b">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="w-5 h-5 text-red-600" />
            <div className={`w-2 h-2 rounded-full ${effectiveIsOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="text-sm font-medium">
                {effectiveIsOpen 
                  ? t("Avoinna", "Open")
                  : t("Suljettu", "Closed")
                }
              </span>
              {!effectiveIsOpen && nextOpening && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t(`Avautuu ${nextOpening.day} ${nextOpening.time}`, `Opens ${nextOpening.day} ${nextOpening.time}`)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Online Ordering Status */}
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <div className={`w-2 h-2 rounded-full ${isOrderingOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs font-medium hidden sm:inline">
                {isOrderingOpen 
                  ? t("Tilaukset avoinna", "Orders open")
                  : t("Tilaukset suljettu", "Orders closed")
                }
              </span>
            </div>
            
            {/* Current Time */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                {currentTime.toLocaleTimeString('fi-FI', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Europe/Helsinki'
                })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Ordering hours info when closed */}
        {!isOrderingOpen && nextOrdering && (
          <div className="mt-2 pt-2 border-t border-red-100 dark:border-red-800">
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              {t(
                `Verkkokauppa avautuu: ${nextOrdering.day} klo ${nextOrdering.time}`,
                `Online ordering opens: ${nextOrdering.day} at ${nextOrdering.time}`
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}