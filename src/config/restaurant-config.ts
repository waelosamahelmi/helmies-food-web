/**
 * Restaurant Configuration
 * Centralized configuration for easy restaurant customization
 */

export interface RestaurantConfig {
  // Basic Information
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  
  // Contact Information
  phone: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  
  // Social Media
  facebook?: string;
  instagram?: string;
  website?: string;
  
  // Business Hours
  hours: {
    general: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
    pickup: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
    delivery: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
  };
  
  // Services
  services: {
    hasLunchBuffet: boolean;
    lunchBuffetHours?: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
    hasDelivery: boolean;
    hasPickup: boolean;
    hasDineIn: boolean;
  };
  
  // Delivery Configuration
  delivery: {
    zones: Array<{
      maxDistance: number;
      fee: number;
      minimumOrder?: number;
    }>;
    location: {
      lat: number;
      lng: number;
    };
  };
  
  // Theme & Branding
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    foreground: string;
  };
  
  // Logo Configuration
  logo: {
    icon: string; // Lucide icon name or emoji
    imageUrl?: string; // URL to logo image
    showText: boolean;
    backgroundColor: string;
  };
  
  // About Section
  about: {
    story: string;
    storyEn: string;
    mission: string;
    missionEn: string;
    specialties: Array<{
      title: string;
      titleEn: string;
      description: string;
      descriptionEn: string;
      icon: string;
    }>;
    experience: string;
    experienceEn: string;
  };
  
  // Hero Section
  hero: {
    backgroundImage: string;
    videoUrl?: string;
    features: Array<{
      title: string;
      titleEn: string;
      color: string;
    }>;
  };
}

// Default configuration for Pizzeria Antonio
export const PIZZERIA_ANTONIO_CONFIG: RestaurantConfig = {
  name: "Pizzeria Antonio",
  nameEn: "Pizzeria Antonio",
  tagline: "Laadukkaita aterioita Lahden sydämessä",
  taglineEn: "Quality meals in the heart of Lahti",
  description: "Pizzeria Antoniossa tarjoamme laadukkaita aterioita ja kutsumme sinut maistamaan herkullisia ruokiamme.",
  descriptionEn: "At Pizzeria Antonio we offer quality meals and invite you to taste our delicious food.",
  
  phone: "+35835899089",
  email: "info@pizzeriaantonio.fi",
  address: {
    street: "Rauhankatu 19 c",
    postalCode: "15110",
    city: "Lahti",
    country: "Finland"
  },
  
  facebook: "https://www.facebook.com/profile.php?id=61577964717473",
  
  hours: {
    general: {
      monday: { open: "10:30", close: "21:30", closed: false },
      tuesday: { open: "10:30", close: "21:30", closed: false },
      wednesday: { open: "10:30", close: "21:30", closed: false },
      thursday: { open: "10:30", close: "21:30", closed: false },
      friday: { open: "11:00", close: "22:00", closed: false },
      saturday: { open: "11:00", close: "05:30", closed: false },
      sunday: { open: "11:00", close: "21:30", closed: false },
    },
    pickup: {
      monday: { open: "10:30", close: "21:30", closed: false },
      tuesday: { open: "10:30", close: "21:30", closed: false },
      wednesday: { open: "10:30", close: "21:30", closed: false },
      thursday: { open: "10:30", close: "21:30", closed: false },
      friday: { open: "11:00", close: "22:00", closed: false },
      saturday: { open: "11:00", close: "05:30", closed: false },
      sunday: { open: "11:00", close: "21:30", closed: false },
    },
    delivery: {
      monday: { open: "10:30", close: "21:30", closed: false },
      tuesday: { open: "10:30", close: "21:30", closed: false },
      wednesday: { open: "10:30", close: "21:30", closed: false },
      thursday: { open: "10:30", close: "21:30", closed: false },
      friday: { open: "11:00", close: "22:00", closed: false },
      saturday: { open: "11:00", close: "05:30", closed: false },
      sunday: { open: "11:00", close: "21:30", closed: false },
    },
  },
  
  services: {
    hasLunchBuffet: false,
    hasDelivery: true,
    hasPickup: true,
    hasDineIn: true,
  },
  
  delivery: {
    zones: [
      { maxDistance: 4, fee: 0.00 },
      { maxDistance: 5, fee: 4.00 },
      { maxDistance: 8, fee: 7.00 },
      { maxDistance: 10, fee: 10.00 }
    ],
    location: {
      lat: 60.9832,
      lng: 25.6608,
    },
  },
  
  theme: {
    primary: "#8B4513", // Saddle brown (dark brown)
    secondary: "#FF8C00", // Dark orange
    accent: "#F5E6D3", // Creamy/beige
    success: "#16a34a", // green-600
    warning: "#ea580c", // orange-600
    error: "#dc2626", // red-600
    background: "#ffffff",
    foreground: "#1f2937", // gray-800
  },
  
  logo: {
    icon: "Pizza",
    imageUrl: "https://foozu3.fi/pizzaadmin/web_admin_common/foodzone//logo/8minqduoo4o4c8kwgw.png",
    showText: true,
    backgroundColor: "#8B4513",
  },
  
  about: {
    story: "Pizzeria Antoniossa tarjoamme laadukkaita aterioita ja kutsumme sinut maistamaan herkullisia ruokiamme.",
    storyEn: "At Pizzeria Antonio we offer quality meals and invite you to taste our delicious food.",
    mission: "Tarjoamme Lahdessa parhaita pizzoja, kebabeja ja muita herkullisia ruokia ystävällisessä palvelussa.",
    missionEn: "We offer the best pizzas, kebabs and other delicious food in Lahti with friendly service.",
    specialties: [
      {
        title: "Premium Pizzat",
        titleEn: "Premium Pizzas",
        description: "Huippulaadukkaita pizzoja tuoreista aineksista",
        descriptionEn: "Premium quality pizzas made from fresh ingredients",
        icon: "Pizza"
      },
      {
        title: "Kebabit",
        titleEn: "Kebabs",
        description: "Meheviä ja maukkaita kebabeja eri vaihtoehdoilla",
        descriptionEn: "Juicy and tasty kebabs with different options",
        icon: "UtensilsCrossed"
      },
      {
        title: "Legendaariset Rullat",
        titleEn: "Legendary Wraps",
        description: "Kuuluisiksi tulleet rullat täynnä makua",
        descriptionEn: "Famous wraps full of flavor",
        icon: "ChefHat"
      },
      {
        title: "Gyros Annokset",
        titleEn: "Gyros Dishes",
        description: "Perinteisiä kreikkalaisia gyros-annoksia",
        descriptionEn: "Traditional Greek gyros dishes",
        icon: "Heart"
      }
    ],
    experience: "Laadukasta ruokaa Lahdessa",
    experienceEn: "Quality food in Lahti"
  },
  
  hero: {
    backgroundImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    videoUrl: "https://videos.pexels.com/video-files/4008533/4008533-hd_1366_720_50fps.mp4",
    features: [
      { title: "Premium pizzat", titleEn: "Premium pizzas", color: "#FF8C00" },
      { title: "Nopea toimitus", titleEn: "Fast delivery", color: "#8B4513" },
      { title: "Laadukkaita aterioita", titleEn: "Quality meals", color: "#F5E6D3" }
    ]
  }
};

// Example configuration for a new restaurant
export const NEW_RESTAURANT_CONFIG: RestaurantConfig = {
  name: "Bella Vista",
  nameEn: "Bella Vista",
  tagline: "Autenttista italialaista makua",
  taglineEn: "Authentic Italian flavors",
  description: "Perinteisiä italialaisia makuja ja tuoreita raaka-aineita",
  descriptionEn: "Traditional Italian flavors and fresh ingredients",
  
  phone: "+358 40 1234567",
  email: "info@bellavista.fi",
  address: {
    street: "Keskuskatu 15",
    postalCode: "00100",
    city: "Helsinki",
    country: "Finland"
  },
  
  facebook: "https://facebook.com/bellavista",
  
  hours: {
    general: {
      monday: { open: "11:00", close: "22:00", closed: false },
      tuesday: { open: "11:00", close: "22:00", closed: false },
      wednesday: { open: "11:00", close: "22:00", closed: false },
      thursday: { open: "11:00", close: "22:00", closed: false },
      friday: { open: "11:00", close: "23:00", closed: false },
      saturday: { open: "12:00", close: "23:00", closed: false },
      sunday: { open: "12:00", close: "21:00", closed: false },
    },
    pickup: {
      monday: { open: "11:00", close: "21:30", closed: false },
      tuesday: { open: "11:00", close: "21:30", closed: false },
      wednesday: { open: "11:00", close: "21:30", closed: false },
      thursday: { open: "11:00", close: "21:30", closed: false },
      friday: { open: "11:00", close: "22:30", closed: false },
      saturday: { open: "12:00", close: "22:30", closed: false },
      sunday: { open: "12:00", close: "20:30", closed: false },
    },
    delivery: {
      monday: { open: "11:00", close: "21:00", closed: false },
      tuesday: { open: "11:00", close: "21:00", closed: false },
      wednesday: { open: "11:00", close: "21:00", closed: false },
      thursday: { open: "11:00", close: "21:00", closed: false },
      friday: { open: "11:00", close: "22:00", closed: false },
      saturday: { open: "12:00", close: "22:00", closed: false },
      sunday: { open: "12:00", close: "20:00", closed: false },
    },
  },
  
  services: {
    hasLunchBuffet: false,
    hasDelivery: true,
    hasPickup: true,
    hasDineIn: true,
  },
  
  delivery: {
    zones: [
      { maxDistance: 5, fee: 2.50 },
      { maxDistance: 15, fee: 4.50, minimumOrder: 25.00 }
    ],
    location: {
      lat: 60.1699,
      lng: 24.9384,
    },
  },
  
  theme: {
    primary: "#059669", // emerald-600
    secondary: "#dc2626", // red-600
    accent: "#f59e0b", // amber-500
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500
    background: "#ffffff",
    foreground: "#1f2937", // gray-800
  },
  
  logo: {
    icon: "Pizza",
    showText: true,
    backgroundColor: "#059669",
  },
  
  about: {
    story: "Olemme ylpeitä italialaisesta perinteestämme ja tarjoamme aitoja makuja jo yli 15 vuoden ajan.",
    storyEn: "We are proud of our Italian heritage and have been serving authentic flavors for over 15 years.",
    mission: "Tuomme Helsinkiin aidon italialaisen ruokakulttuurin ja tarjoamme unohtumattomia makuelämyksiä.",
    missionEn: "We bring authentic Italian food culture to Helsinki and provide unforgettable taste experiences.",
    specialties: [
      {
        title: "Napoli-tyylinen pizza",
        titleEn: "Neapolitan Pizza",
        description: "Perinteinen napolityyppinen pizza kivuunissa paistettuna",
        descriptionEn: "Traditional Neapolitan pizza baked in stone oven",
        icon: "Pizza"
      },
      {
        title: "Tuore pasta",
        titleEn: "Fresh Pasta",
        description: "Päivittäin valmistettua tuoretta pastaa italialaisittain",
        descriptionEn: "Daily made fresh pasta in Italian style",
        icon: "UtensilsCrossed"
      },
      {
        title: "Italialainen kahvi",
        titleEn: "Italian Coffee",
        description: "Aitoa italialaista espressoa ja cappuccinoa",
        descriptionEn: "Authentic Italian espresso and cappuccino",
        icon: "Coffee"
      },
      {
        title: "Tuoreet salaatit",
        titleEn: "Fresh Salads",
        description: "Välimerellisiä salaatteja tuoreista aineksista",
        descriptionEn: "Mediterranean salads from fresh ingredients",
        icon: "Salad"
      }
    ],
    experience: "Yli 15 vuotta kokemusta",
    experienceEn: "15+ Years Experience"
  },
  
  hero: {
    backgroundImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    videoUrl: "https://videos.pexels.com/video-files/3298637/3298637-hd_1366_720_50fps.mp4",
    features: [
      { title: "Kivuunissa paistettu", titleEn: "Stone oven baked", color: "#dc2626" },
      { title: "Tuoreet ainekset", titleEn: "Fresh ingredients", color: "#059669" },
      { title: "Italialainen perinne", titleEn: "Italian tradition", color: "#f59e0b" }
    ]
  }
};

// Current active configuration - change this to switch restaurants
export const RESTAURANT_CONFIG = PIZZERIA_ANTONIO_CONFIG;

// Helper functions
export const getFullAddress = (config: RestaurantConfig) => {
  return `${config.address.street}, ${config.address.postalCode} ${config.address.city}`;
};

export const getFormattedHours = (hours: any, language: string) => {
  const days = language === "fi" 
    ? ["Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai", "Sunnuntai"]
    : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  return dayKeys.map((key, index) => ({
    day: days[index],
    ...hours[key]
  }));
};