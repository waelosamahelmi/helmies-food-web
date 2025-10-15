/**
 * Business Hours Management
 * Handles restaurant opening/closing times and service availability
 */
import { RestaurantConfig, WeekSchedule } from "@/config/restaurant-config";

export interface BusinessHours {
  day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isOpen: boolean;
}

export interface ServiceHours {
  pickup: BusinessHours[];
  delivery: BusinessHours[];
  general: BusinessHours[];
}

// Convert restaurant config hours to business hours format
function getBusinessHoursFromConfig(config: RestaurantConfig): ServiceHours {
  const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  const convertHours = (hoursConfig: WeekSchedule) => {
    return dayMapping.map((dayKey, index) => {
      const dayHours = hoursConfig[dayKey as keyof WeekSchedule];
      return {
        day: index,
        openTime: dayHours.open,
        closeTime: dayHours.close,
        isOpen: !dayHours.closed
      };
    });
  };
  
  return {
    general: convertHours(config.hours.general),
    pickup: convertHours(config.hours.pickup),
    delivery: convertHours(config.hours.delivery),
  };
}

/**
 * Convert time string to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current time in Finland timezone
 */
function getCurrentFinnishTime(): Date {
  // Use Intl.DateTimeFormat for more reliable timezone conversion
  const now = new Date();
  const finnishTime = new Date(now.toLocaleString("sv-SE", { timeZone: "Europe/Helsinki" }));
  return finnishTime;
}

/**
 * Check if restaurant is open for general operations
 */
export function isRestaurantOpen(config: RestaurantConfig, customTime?: Date): boolean {
  if (!config) {
    console.warn('⚠️ No restaurant config provided to isRestaurantOpen');
    return false;
  }
  
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const businessHours = getBusinessHoursFromConfig(config);

  console.log('Business Hours Debug:', {
    currentTime: now.toISOString(),
    currentDay,
    currentMinutes,
    currentHour: now.getHours(),
    currentMinute: now.getMinutes()
  });

  const todayHours = businessHours.general.find(h => h.day === currentDay);
  
  if (!todayHours || !todayHours.isOpen) {
    console.log('Restaurant closed - no hours for today or marked as closed');
    return false;
  }

  const openMinutes = timeToMinutes(todayHours.openTime);
  const closeMinutes = timeToMinutes(todayHours.closeTime);

  // Handle overnight hours (when close time is next day)
  const isOvernight = closeMinutes < openMinutes;
  let isOpen;
  
  if (isOvernight) {
    // Restaurant is open from openTime until midnight, then from midnight until closeTime next day
    isOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    // Normal same-day hours
    isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  console.log('Business Hours Check:', {
    todayHours,
    openMinutes,
    closeMinutes,
    currentMinutes,
    isOvernight,
    isOpen
  });

  return isOpen;
}

/**
 * Check if pickup service is available
 */
export function isPickupAvailable(config: RestaurantConfig, customTime?: Date): boolean {
  if (!config) return false;
  
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const businessHours = getBusinessHoursFromConfig(config);

  const todayHours = businessHours.pickup.find(h => h.day === currentDay);
  
  if (!todayHours || !todayHours.isOpen) {
    return false;
  }

  const openMinutes = timeToMinutes(todayHours.openTime);
  const closeMinutes = timeToMinutes(todayHours.closeTime);

  // Handle overnight hours (when close time is next day)
  const isOvernight = closeMinutes < openMinutes;
  
  if (isOvernight) {
    // Restaurant is open from openTime until midnight, then from midnight until closeTime next day
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    // Normal same-day hours
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }
}

/**
 * Check if delivery service is available
 */
export function isDeliveryAvailable(config: RestaurantConfig, customTime?: Date): boolean {
  if (!config) return false;
  
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const businessHours = getBusinessHoursFromConfig(config);

  const todayHours = businessHours.delivery.find(h => h.day === currentDay);
  
  if (!todayHours || !todayHours.isOpen) {
    return false;
  }

  const openMinutes = timeToMinutes(todayHours.openTime);
  const closeMinutes = timeToMinutes(todayHours.closeTime);

  // Handle overnight hours (when close time is next day)
  const isOvernight = closeMinutes < openMinutes;
  
  if (isOvernight) {
    // Restaurant is open from openTime until midnight, then from midnight until closeTime next day
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    // Normal same-day hours
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }
}

/**
 * Check if online ordering is available (either pickup or delivery)
 */
export function isOnlineOrderingAvailable(config: RestaurantConfig, customTime?: Date): boolean {
  if (!config) return false;
  return isPickupAvailable(config, customTime) || isDeliveryAvailable(config, customTime);
}

/**
 * Get next opening time for general restaurant
 */
export function getNextOpeningTime(config: RestaurantConfig, customTime?: Date): { day: string; time: string } | null {
  if (!config) return null;
  
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const businessHours = getBusinessHoursFromConfig(config);

  const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Check if we can open today
  const todayHours = businessHours.general.find(h => h.day === currentDay);
  if (todayHours && todayHours.isOpen) {
    const openMinutes = timeToMinutes(todayHours.openTime);
    if (currentMinutes < openMinutes) {
      return {
        day: dayNames[currentDay],
        time: todayHours.openTime
      };
    }
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const dayHours = businessHours.general.find(h => h.day === checkDay);
    
    if (dayHours && dayHours.isOpen) {
      return {
        day: dayNames[checkDay],
        time: dayHours.openTime
      };
    }
  }

  return null;
}

/**
 * Get next opening time for online ordering
 */
export function getNextOrderingTime(config: RestaurantConfig, customTime?: Date): { day: string; time: string } | null {
  if (!config) return null;
  
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const businessHours = getBusinessHoursFromConfig(config);

  const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];

  // Check if we can order today
  const todayPickup = businessHours.pickup.find(h => h.day === currentDay);
  const todayDelivery = businessHours.delivery.find(h => h.day === currentDay);
  
  if (todayPickup && todayPickup.isOpen) {
    const openMinutes = timeToMinutes(todayPickup.openTime);
    if (currentMinutes < openMinutes) {
      return {
        day: dayNames[currentDay],
        time: todayPickup.openTime
      };
    }
  }

  if (todayDelivery && todayDelivery.isOpen) {
    const openMinutes = timeToMinutes(todayDelivery.openTime);
    if (currentMinutes < openMinutes) {
      return {
        day: dayNames[currentDay],
        time: todayDelivery.openTime
      };
    }
  }

  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const pickupHours = businessHours.pickup.find(h => h.day === checkDay);
    const deliveryHours = businessHours.delivery.find(h => h.day === checkDay);
    
    if ((pickupHours && pickupHours.isOpen) || (deliveryHours && deliveryHours.isOpen)) {
      const earliestTime = pickupHours && pickupHours.isOpen 
        ? pickupHours.openTime 
        : deliveryHours!.openTime;
      
      return {
        day: dayNames[checkDay],
        time: earliestTime
      };
    }
  }

  return null;
}

/**
 * Get current restaurant status information
 */
export function getRestaurantStatus(config: RestaurantConfig, customTime?: Date) {
  if (!config) {
    return {
      isOpen: false,
      isOrderingOpen: false,
      isPickupOpen: false,
      isDeliveryOpen: false,
      nextOpening: null,
      nextOrdering: null
    };
  }
  
  const isOpen = isRestaurantOpen(config, customTime);
  const isOrderingOpen = isOnlineOrderingAvailable(config, customTime);
  const isPickupOpen = isPickupAvailable(config, customTime);
  const isDeliveryOpen = isDeliveryAvailable(config, customTime);
  
  const nextOpening = getNextOpeningTime(config, customTime);
  const nextOrdering = getNextOrderingTime(config, customTime);

  return {
    isOpen,
    isOrderingOpen,
    isPickupOpen,
    isDeliveryOpen,
    nextOpening,
    nextOrdering
  };
}

/**
 * Get business hours for display
 */
export function getBusinessHours(config: RestaurantConfig): ServiceHours {
  return getBusinessHoursFromConfig(config);
}
