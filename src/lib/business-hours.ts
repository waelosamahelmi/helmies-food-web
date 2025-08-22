/**
 * Business Hours Management
 * Handles restaurant opening/closing times and service availability
 */
import { RESTAURANT_CONFIG } from "@/config/restaurant-config";
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
function getBusinessHoursFromConfig(config: RestaurantConfig = RESTAURANT_CONFIG): ServiceHours {
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
export function isRestaurantOpen(customTime?: Date, config?: RestaurantConfig): boolean {
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

  console.log('Business Hours Check:', {
    todayHours,
    openMinutes,
    closeMinutes,
    currentMinutes,
    isOpen: currentMinutes >= openMinutes && currentMinutes <= closeMinutes
  });

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Check if pickup service is available
 */
export function isPickupAvailable(customTime?: Date, config?: RestaurantConfig): boolean {
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

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Check if delivery service is available
 */
export function isDeliveryAvailable(customTime?: Date, config?: RestaurantConfig): boolean {
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

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Check if online ordering is available (either pickup or delivery)
 */
export function isOnlineOrderingAvailable(customTime?: Date, config?: RestaurantConfig): boolean {
  return isPickupAvailable(customTime, config) || isDeliveryAvailable(customTime, config);
}

/**
 * Get next opening time for general restaurant
 */
export function getNextOpeningTime(customTime?: Date, config?: RestaurantConfig): { day: string; time: string } | null {
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
export function getNextOrderingTime(customTime?: Date, config?: RestaurantConfig): { day: string; time: string } | null {
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
export function getRestaurantStatus(customTime?: Date, config?: RestaurantConfig) {
  const isOpen = isRestaurantOpen(customTime, config);
  const isOrderingOpen = isOnlineOrderingAvailable(customTime, config);
  const isPickupOpen = isPickupAvailable(customTime, config);
  const isDeliveryOpen = isDeliveryAvailable(customTime, config);
  
  const nextOpening = getNextOpeningTime(customTime, config);
  const nextOrdering = getNextOrderingTime(customTime, config);

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
export function getBusinessHours(config?: RestaurantConfig): ServiceHours {
  return getBusinessHoursFromConfig(config);
}
