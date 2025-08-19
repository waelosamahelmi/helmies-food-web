# Restaurant Customization Guide

This guide explains how to easily customize the restaurant website for different restaurants.

## Quick Setup for New Restaurant

To adapt this website for a new restaurant, you only need to modify the configuration in `src/config/restaurant-config.ts`.

### Step 1: Update Restaurant Configuration

Edit `src/config/restaurant-config.ts` and change the `RESTAURANT_CONFIG` constant:

```typescript
// Change this line to use your new restaurant config
export const RESTAURANT_CONFIG = NEW_RESTAURANT_CONFIG; // or your custom config
```

### Step 2: Create Your Restaurant Configuration

Copy the `NEW_RESTAURANT_CONFIG` example and customize it:

```typescript
export const YOUR_RESTAURANT_CONFIG: RestaurantConfig = {
  // Basic Information
  name: "Your Restaurant Name",
  nameEn: "Your Restaurant Name",
  tagline: "Your tagline in Finnish",
  taglineEn: "Your tagline in English",
  description: "Your description in Finnish",
  descriptionEn: "Your description in English",
  
  // Contact Information
  phone: "+358 XX XXXXXXX",
  email: "info@yourrestaurant.fi",
  address: {
    street: "Your Street Address",
    postalCode: "XXXXX",
    city: "Your City",
    country: "Finland"
  },
  
  // Social Media (optional)
  facebook: "https://facebook.com/yourrestaurant",
  
  // Business Hours
  hours: {
    general: {
      monday: { open: "11:00", close: "22:00", closed: false },
      // ... configure all days
    },
    pickup: {
      // ... configure pickup hours
    },
    delivery: {
      // ... configure delivery hours
    },
  },
  
  // Services
  services: {
    hasLunchBuffet: false, // Set to true if you have lunch buffet
    hasDelivery: true,
    hasPickup: true,
    hasDineIn: true,
  },
  
  // Delivery Configuration
  delivery: {
    zones: [
      { maxDistance: 5, fee: 2.50 },
      { maxDistance: 15, fee: 4.50, minimumOrder: 25.00 }
    ],
    location: {
      lat: 60.1699, // Your restaurant's latitude
      lng: 24.9384, // Your restaurant's longitude
    },
  },
  
  // Theme & Colors
  theme: {
    primary: "#059669", // Your primary color
    secondary: "#dc2626", // Your secondary color
    accent: "#f59e0b", // Your accent color
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    background: "#ffffff",
    foreground: "#1f2937",
  },
  
  // Logo
  logo: {
    icon: "Pizza", // Any Lucide icon name
    showText: true,
    backgroundColor: "#059669", // Usually same as primary
  },
  
  // About Section Content
  about: {
    story: "Your restaurant story in Finnish",
    storyEn: "Your restaurant story in English",
    mission: "Your mission in Finnish",
    missionEn: "Your mission in English",
    specialties: [
      {
        title: "Specialty 1",
        titleEn: "Specialty 1",
        description: "Description in Finnish",
        descriptionEn: "Description in English",
        icon: "Pizza" // Lucide icon name
      },
      // Add more specialties...
    ],
    experience: "Your experience text",
    experienceEn: "Your experience text in English"
  },
  
  // Hero Section
  hero: {
    backgroundImage: "https://your-background-image-url.jpg",
    videoUrl: "https://your-video-url.mp4", // Optional
    features: [
      { title: "Feature 1", titleEn: "Feature 1", color: "#dc2626" },
      { title: "Feature 2", titleEn: "Feature 2", color: "#059669" },
      { title: "Feature 3", titleEn: "Feature 3", color: "#f59e0b" }
    ]
  }
};
```

## What Gets Updated Automatically

When you change the configuration, the following elements are automatically updated throughout the website:

### 🏢 Restaurant Information
- Restaurant name in header, footer, and all pages
- Contact information (phone, email, address)
- Social media links

### 🎨 Visual Design
- Logo icon and colors
- Primary, secondary, and accent colors throughout the site
- Theme colors for buttons, badges, and highlights

### ⏰ Business Hours
- Opening hours display
- Pickup service hours
- Delivery service hours
- Lunch buffet hours (if enabled)

### 🚚 Delivery Configuration
- Delivery zones and fees
- Minimum order amounts
- Restaurant location for distance calculations

### 📖 Content
- About section story and mission
- Restaurant specialties
- Hero section tagline and description
- Service descriptions

### 🍽️ Services
- Show/hide lunch buffet sections
- Enable/disable delivery service
- Enable/disable pickup service
- Configure service-specific hours

## File Structure

```
src/
├── config/
│   └── restaurant-config.ts     # Main configuration file
├── lib/
│   └── restaurant-context.tsx   # React context for config
├── components/
│   ├── universal-header.tsx     # Unified header for all pages
│   ├── logo.tsx                 # Dynamic logo component
│   └── ...                      # Other components use config
└── pages/
    └── ...                      # All pages use universal header
```

## Benefits

✅ **Single source of truth**: All restaurant information in one file
✅ **Consistent design**: Universal header across all pages
✅ **Easy customization**: Change config, everything updates
✅ **Type safety**: TypeScript ensures all required fields are provided
✅ **Flexible services**: Enable/disable features per restaurant
✅ **Dynamic theming**: Colors and branding update automatically
✅ **Maintainable**: Easy to add new restaurants or update existing ones

## Adding a New Restaurant

1. Create a new configuration object in `restaurant-config.ts`
2. Update the `RESTAURANT_CONFIG` export to use your new config
3. Optionally update the hero background image and video
4. Test all pages to ensure everything displays correctly

That's it! The entire website will adapt to your new restaurant configuration.