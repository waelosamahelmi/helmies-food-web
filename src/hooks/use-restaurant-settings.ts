import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DatabaseRestaurantSettings, RESTAURANT_CONFIG, convertDatabaseHoursToWeekSchedule } from '../config/restaurant-config';

// Global state manager for restaurant settings
class RestaurantSettingsManager {
  private static instance: RestaurantSettingsManager;
  private subscribers: Set<(settings: DatabaseRestaurantSettings | null) => void> = new Set();
  private subscription: any = null;
  private currentSettings: DatabaseRestaurantSettings | null = null;
  private isInitialized = false;

  static getInstance(): RestaurantSettingsManager {
    if (!RestaurantSettingsManager.instance) {
      RestaurantSettingsManager.instance = new RestaurantSettingsManager();
    }
    return RestaurantSettingsManager.instance;
  }

  subscribe(callback: (settings: DatabaseRestaurantSettings | null) => void) {
    this.subscribers.add(callback);
    
    // Initialize subscription if this is the first subscriber
    if (this.subscribers.size === 1 && !this.subscription) {
      this.initializeSubscription();
    }
    
    // Send current settings immediately if available
    if (this.isInitialized) {
      callback(this.currentSettings);
    }

    return () => {
      this.subscribers.delete(callback);
      // Clean up subscription if no more subscribers
      if (this.subscribers.size === 0 && this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    };
  }

  private async initializeSubscription() {
    try {
      // Fetch initial data
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .single();

      if (!error && data) {
        this.currentSettings = data;
      }
      
      this.isInitialized = true;
      this.notifySubscribers();

      // Set up real-time subscription
      this.subscription = supabase
        .channel(`restaurant_settings_${Date.now()}`) // Unique channel name
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'restaurant_settings',
          },
          (payload) => {
            console.log('Restaurant settings changed:', payload);
            if (payload.new && typeof payload.new === 'object') {
              this.currentSettings = payload.new as DatabaseRestaurantSettings;
              this.notifySubscribers();
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Error initializing restaurant settings subscription:', error);
      this.isInitialized = true;
      this.notifySubscribers();
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentSettings));
  }
}

export function useRestaurantSettings() {
  const [dbSettings, setDbSettings] = useState<DatabaseRestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const manager = RestaurantSettingsManager.getInstance();
    
    const unsubscribe = manager.subscribe((settings) => {
      setDbSettings(settings);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Create a config with merged hours from database
  const config = {
    ...RESTAURANT_CONFIG,
    hours: dbSettings ? {
      general: convertDatabaseHoursToWeekSchedule(dbSettings.opening_hours),
      pickup: convertDatabaseHoursToWeekSchedule(dbSettings.pickup_hours),
      delivery: convertDatabaseHoursToWeekSchedule(dbSettings.delivery_hours),
    } : RESTAURANT_CONFIG.hours,
    services: {
      ...RESTAURANT_CONFIG.services,
      lunchBuffetHours: dbSettings?.lunch_buffet_hours 
        ? convertDatabaseHoursToWeekSchedule(dbSettings.lunch_buffet_hours)
        : RESTAURANT_CONFIG.services.lunchBuffetHours,
    }
  };

  return {
    config,
    dbSettings,
    loading,
    error,
    isOpen: dbSettings?.is_open ?? true,
    specialMessage: dbSettings?.special_message,
  };
}
