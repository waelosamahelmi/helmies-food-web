/**
 * Business Hours Management
 * Handles restaurant opening/closing times and service availability
 */

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

// Default business hours configuration
const DEFAULT_BUSINESS_HOURS: ServiceHours = {
  // General restaurant hours - open all day for testing
  general: [
    { day: 1, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Monday
    { day: 2, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Tuesday
    { day: 3, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Wednesday
    { day: 4, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Thursday
    { day: 5, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Friday
    { day: 6, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Saturday
    { day: 0, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Sunday
  ],
  // Pickup service hours - open all day for testing
  pickup: [
    { day: 1, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Monday
    { day: 2, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Tuesday
    { day: 3, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Wednesday
    { day: 4, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Thursday
    { day: 5, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Friday
    { day: 6, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Saturday
    { day: 0, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Sunday
  ],
  // Delivery service hours - open all day for testing
  delivery: [
    { day: 1, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Monday
    { day: 2, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Tuesday
    { day: 3, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Wednesday
    { day: 4, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Thursday
    { day: 5, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Friday
    { day: 6, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Saturday
    { day: 0, openTime: "00:00", closeTime: "23:59", isOpen: true }, // Sunday
  ],
};

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
export function isRestaurantOpen(customTime?: Date): boolean {
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  console.log('Business Hours Debug:', {
    currentTime: now.toISOString(),
    currentDay,
    currentMinutes,
    currentHour: now.getHours(),
    currentMinute: now.getMinutes()
  });

  const todayHours = DEFAULT_BUSINESS_HOURS.general.find(h => h.day === currentDay);
  
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
export function isPickupAvailable(customTime?: Date): boolean {
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayHours = DEFAULT_BUSINESS_HOURS.pickup.find(h => h.day === currentDay);
  
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
export function isDeliveryAvailable(customTime?: Date): boolean {
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayHours = DEFAULT_BUSINESS_HOURS.delivery.find(h => h.day === currentDay);
  
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
export function isOnlineOrderingAvailable(customTime?: Date): boolean {
  return isPickupAvailable(customTime) || isDeliveryAvailable(customTime);
}

/**
 * Get next opening time for general restaurant
 */
export function getNextOpeningTime(customTime?: Date): { day: string; time: string } | null {
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Check if we can open today
  const todayHours = DEFAULT_BUSINESS_HOURS.general.find(h => h.day === currentDay);
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
    const dayHours = DEFAULT_BUSINESS_HOURS.general.find(h => h.day === checkDay);
    
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
export function getNextOrderingTime(customTime?: Date): { day: string; time: string } | null {
  const now = customTime || getCurrentFinnishTime();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];

  // Check if we can order today
  const todayPickup = DEFAULT_BUSINESS_HOURS.pickup.find(h => h.day === currentDay);
  const todayDelivery = DEFAULT_BUSINESS_HOURS.delivery.find(h => h.day === currentDay);
  
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
    const pickupHours = DEFAULT_BUSINESS_HOURS.pickup.find(h => h.day === checkDay);
    const deliveryHours = DEFAULT_BUSINESS_HOURS.delivery.find(h => h.day === checkDay);
    
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
export function getRestaurantStatus(customTime?: Date) {
  const isOpen = isRestaurantOpen(customTime);
  const isOrderingOpen = isOnlineOrderingAvailable(customTime);
  const isPickupOpen = isPickupAvailable(customTime);
  const isDeliveryOpen = isDeliveryAvailable(customTime);
  
  const nextOpening = getNextOpeningTime(customTime);
  const nextOrdering = getNextOrderingTime(customTime);

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
export function getBusinessHours(): ServiceHours {
  return DEFAULT_BUSINESS_HOURS;
}
