import { createContext, useContext, useState, useEffect } from "react";
import { RESTAURANT_CONFIG, type RestaurantConfig } from "@/config/restaurant-config";

interface RestaurantContextType {
  config: RestaurantConfig;
  updateConfig: (newConfig: RestaurantConfig) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    // Always use the current RESTAURANT_CONFIG to ensure latest updates
    // Comment out localStorage loading for now to force fresh config
    // const savedConfig = localStorage.getItem('restaurant-config');
    // if (savedConfig) {
    //   try {
    //     const parsed = JSON.parse(savedConfig);
    //     // Merge with current config to ensure all new properties are included
    //     return { ...RESTAURANT_CONFIG, ...parsed };
    //   } catch (error) {
    //     console.error('Failed to parse saved config:', error);
    //   }
    // }
    return RESTAURANT_CONFIG;
  });

  const updateConfig = (newConfig: RestaurantConfig) => {
    setConfig(newConfig);
    localStorage.setItem('restaurant-config', JSON.stringify(newConfig));
  };

  return (
    <RestaurantContext.Provider value={{ config, updateConfig }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}