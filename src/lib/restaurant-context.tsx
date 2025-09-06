import { createContext, useContext, useState, useEffect } from "react";
import { type RestaurantConfig, PIZZERIA_ANTONIO_CONFIG } from "@/config/restaurant-config";
import { useRestaurantConfig } from "@/hooks/use-restaurant-config";

interface RestaurantContextType {
  config: RestaurantConfig;
  updateConfig: (updates: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { config: dbConfig, loading, error, updateConfig: updateDbConfig } = useRestaurantConfig();
  
  // Use database config if available, otherwise fallback to hardcoded config
  const config = dbConfig || PIZZERIA_ANTONIO_CONFIG;

  return (
    <RestaurantContext.Provider value={{ 
      config, 
      updateConfig: updateDbConfig, 
      loading, 
      error 
    }}>
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