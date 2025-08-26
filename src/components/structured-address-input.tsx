/**
 * Enhanced Structured Address Input Component
 * Provides separate fields for street address, postal code, and city
 * with validation, auto-completion, and interactive map
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Navigation, Calculator, AlertCircle, Check, Map } from 'lucide-react';
import { useLanguage } from '../lib/language-context';
import { 
  RESTAURANT_LOCATION, 
  calculateDistance, 
  calculateDeliveryFee, 
  getDeliveryZone,
  geocodeAddress,
  reverseGeocode,
  isWithinFinland
} from '../lib/map-utils';

interface AddressData {
  streetAddress: string;
  postalCode: string;
  city: string;
  fullAddress: string;
}

interface StructuredAddressInputProps {
  onAddressChange: (addressData: AddressData) => void;
  onDeliveryCalculated: (fee: number, distance: number, fullAddress: string) => void;
  initialAddress?: string;
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    street?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    district?: string;
    building?: string;
    apartment?: string;
    unit?: string;
  };
  importance?: number;
  type?: string;
}

export function StructuredAddressInput({ 
  onAddressChange, 
  onDeliveryCalculated,
  initialAddress = ""
}: StructuredAddressInputProps) {
  const { language, t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [addressData, setAddressData] = useState<AddressData>({
    streetAddress: "",
    postalCode: "",
    city: "",
    fullAddress: ""
  });
  
  const [searchInput, setSearchInput] = useState("");
  
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    distance: number;
    fee: number;
    zone: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  // Parse initial address if provided
  useEffect(() => {
    if (initialAddress) {
      parseInitialAddress(initialAddress);
    }
  }, [initialAddress]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !showMap || mapInitialized) return;

    const mapContainer = mapRef.current;
    const mapId = `map-${Date.now()}`;
    
    // Add Leaflet CSS and JS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    linkElement.crossOrigin = '';
    document.head.appendChild(linkElement);

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    scriptElement.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    scriptElement.crossOrigin = '';
    
    scriptElement.onload = () => {
      mapContainer.innerHTML = `<div id="${mapId}" style="width: 100%; height: 250px; border-radius: 8px; z-index: 1;"></div>`;
      
      // Initialize Leaflet map
      const L = (window as any).L;
      const map = L.map(mapId).setView([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Add restaurant marker
      const restaurantIcon = L.divIcon({
        html: `<div style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3); white-space: nowrap;">🍕 Pizzeria Antonio</div>`,
        className: 'custom-marker',
        iconSize: [100, 25],
        iconAnchor: [50, 25]
      });
      
      L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], { icon: restaurantIcon, isRestaurant: true })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>Pizzeria Antonio</strong><br>
            <small>${RESTAURANT_LOCATION.address}</small>
          </div>
        `);
      
      // Store map reference for later use
      (mapRef.current as any).leafletMap = map;
    };
    
    document.head.appendChild(scriptElement);
    setMapInitialized(true);
  }, [showMap, mapInitialized]);

  const parseInitialAddress = (address: string) => {
    // Enhanced address parsing for Finnish addresses
    console.log('Parsing address:', address);
    
    let streetAddress = "";
    let postalCode = "";
    let city = "";
    
    // Try different parsing approaches
    
    // Approach 1: Standard format "Street Address, Postal Code City"
    const standardMatch = address.match(/^(.+?),\s*(\d{5})\s+(.+)$/);
    if (standardMatch) {
      streetAddress = standardMatch[1].trim();
      postalCode = standardMatch[2];
      city = standardMatch[3].trim();
    } else {
      // Approach 2: Look for postal code pattern anywhere in the address
      const postalMatch = address.match(/(\d{5})/);
      if (postalMatch) {
        postalCode = postalMatch[1];
        
        // Split by postal code and extract parts
        const parts = address.split(postalCode);
        if (parts.length >= 2) {
          streetAddress = parts[0].replace(/,\s*$/, '').trim();
          city = parts[1].replace(/^,?\s*/, '').trim();
        }
      } else {
        // Approach 3: Split by commas and try to identify parts
        const parts = address.split(',').map(part => part.trim());
        
        if (parts.length >= 3) {
          streetAddress = parts[0];
          // Look for postal code in middle parts
          for (let i = 1; i < parts.length - 1; i++) {
            const pcMatch = parts[i].match(/(\d{5})/);
            if (pcMatch) {
              postalCode = pcMatch[1];
              city = parts.slice(i).join(' ').replace(postalCode, '').trim();
              break;
            }
          }
          if (!postalCode) {
            city = parts[parts.length - 1];
          }
        } else if (parts.length >= 1) {
          streetAddress = parts[0];
          if (parts.length >= 2) {
            city = parts[parts.length - 1];
          }
        }
      }
    }
    
    console.log('Parsed components:', { streetAddress, postalCode, city });
    
    const newAddressData = {
      streetAddress,
      postalCode,
      city,
      fullAddress: address
    };
    
    setAddressData(newAddressData);
    onAddressChange(newAddressData);
  };

  const updateFullAddress = useCallback((data: Partial<AddressData>) => {
    const updated = { ...addressData, ...data };
    
    // Build full address from components
    let fullAddress = "";
    if (updated.streetAddress) {
      fullAddress = updated.streetAddress;
    }
    if (updated.postalCode && updated.city) {
      fullAddress += fullAddress ? `, ${updated.postalCode} ${updated.city}` : `${updated.postalCode} ${updated.city}`;
    } else if (updated.city) {
      fullAddress += fullAddress ? `, ${updated.city}` : updated.city;
    }
    
    updated.fullAddress = fullAddress;
    setAddressData(updated);
    onAddressChange(updated);
    
    // Clear error when user types
    if (error) setError("");
    
    return updated;
  }, [addressData, onAddressChange, error]);

  const handleStreetAddressChange = (value: string) => {
    const updated = updateFullAddress({ streetAddress: value });
    
    // Fetch suggestions when typing street address
    if (value.length > 3) {
      fetchAddressSuggestions(updated.fullAddress);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handlePostalCodeChange = (value: string) => {
    // Only allow digits and limit to 5 characters (Finnish postal code format)
    const cleaned = value.replace(/\D/g, '').slice(0, 5);
    updateFullAddress({ postalCode: cleaned });
  };

  const handleCityChange = (value: string) => {
    updateFullAddress({ city: value });
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(query + ', Finland')}` +
        `&countrycodes=fi&limit=5&addressdetails=1` +
        `&featuretype=street&featuretype=house&featuretype=building`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TirvaRestaurant/1.0' // Required by Nominatim ToS
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions');
      }

      const data: AddressSuggestion[] = await response.json();
      setSuggestions(
        data.filter(item => 
          item.address && 
          (item.address.road || item.address.street) &&
          item.address.postcode &&
          isWithinFinland(parseFloat(item.lat), parseFloat(item.lon))
        )
      );
    } catch (error) {
      console.warn('Address suggestion fetch failed:', error);
      setError(t(
        "Osoitteen haku epäonnistui. Yritä uudelleen.",
        "Failed to fetch address suggestions. Please try again."
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    const addr = suggestion.address;
    
    // Improved street address formatting
    let streetAddress = '';
    if (addr.road || addr.street) {
      streetAddress = [
        addr.house_number,
        addr.road || addr.street,
        addr.building || addr.apartment || addr.unit || ''
      ].filter(Boolean).join(' ').trim();
    }
    
    // More comprehensive city detection
    const city = addr.city || addr.town || addr.village || addr.municipality || 
                addr.suburb || addr.district || '';
                
    // Get postal code
    const postalCode = addr.postcode || '';
    
    // Format a cleaner full address
    const fullAddress = [
      streetAddress,
      postalCode,
      city
    ].filter(Boolean).join(', ');
    
    const newAddressData = {
      streetAddress,
      postalCode,
      city,
      fullAddress
    };
    
    setAddressData(newAddressData);
    onAddressChange(newAddressData);
    setShowSuggestions(false);
    
    // Auto-calculate delivery if we have a complete address
    if (streetAddress && city && postalCode) {
      handleCalculateDelivery(fullAddress, parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    }
  };

  const handleCalculateDelivery = async (fullAddress?: string, lat?: number, lng?: number) => {
    const addressToUse = fullAddress || addressData.fullAddress;
    
    if (!addressToUse.trim() || (!addressData.streetAddress && !addressData.city)) {
      setError(t("Täytä vähintään katuosoite ja kaupunki", "Fill in at least street address and city"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let coordinates = { lat, lng };
      
      if (!coordinates.lat || !coordinates.lng) {
        // Geocode the address using Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `format=json&q=${encodeURIComponent(addressToUse)}` +
          `&countrycodes=fi&limit=1&addressdetails=1`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'TirvaRestaurant/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Geocoding request failed');
        }

        const data = await response.json();
        
        if (!data || data.length === 0) {
          throw new Error('Address not found');
        }

        coordinates = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };

        if (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number' || 
            isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
          throw new Error('Invalid coordinates received');
        }
      }

      // Ensure coordinates are valid numbers
      if (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
        throw new Error('Invalid coordinates');
      }

      if (!isWithinFinland(coordinates.lat, coordinates.lng)) {
        setError(t("Toimitus vain Suomessa", "Delivery only in Finland"));
        return;
      }
      
      // Calculate delivery fee using map utils
      const distance = calculateDistance(
        RESTAURANT_LOCATION.lat,
        RESTAURANT_LOCATION.lng,
        coordinates.lat,
        coordinates.lng
      );
      
      const fee = calculateDeliveryFee(distance);
      const zone = getDeliveryZone(distance);
      
      if (fee === -1) {
        setError(t("Alue ei ole toimitus-alueella", "Area is outside delivery zone"));
        return;
      }

      const info = {
        distance: Math.round(distance * 10) / 10,
        fee: Number(fee.toFixed(2)), // Ensure fee is formatted with 2 decimal places
        zone: zone.description,
        coordinates: { lat: coordinates.lat, lng: coordinates.lng }
      };

      setDeliveryInfo(info);
      onDeliveryCalculated(Number(fee.toFixed(2)), info.distance, addressToUse);
      
      // Show map and update with route
      if (!showMap) {
        setShowMap(true);
        setTimeout(() => updateMapWithRoute(info, addressToUse), 1000);
      } else {
        updateMapWithRoute(info, addressToUse);
      }
      
    } catch (error) {
      console.error('Delivery calculation error:', error);
      setError(t("Virhe laskettaessa toimitusta. Tarkista osoite.", "Error calculating delivery. Check the address."));
    } finally {
      setIsLoading(false);
    }
  };

  const updateMapWithRoute = (info: typeof deliveryInfo, customerAddress: string) => {
    if (!info) return;
    
    const leafletMap = (mapRef.current as any)?.leafletMap;
    if (!leafletMap) return;

    const L = (window as any).L;
    
    // Clear existing customer markers and routes
    leafletMap.eachLayer((layer: any) => {
      if (layer instanceof L.Marker && !layer.options.isRestaurant) {
        leafletMap.removeLayer(layer);
      }
      if (layer instanceof L.Polyline) {
        leafletMap.removeLayer(layer);
      }
    });

    // Add customer marker
    const customerIcon = L.divIcon({
      html: `<div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3); white-space: nowrap;">🏠 ${t("Sinun osoite", "Your address")}</div>`,
      className: 'custom-marker',
      iconSize: [100, 25],
      iconAnchor: [50, 25]
    });

    const customerMarker = L.marker([info.coordinates.lat, info.coordinates.lng], { 
      icon: customerIcon,
      isRestaurant: false 
    }).addTo(leafletMap);

    customerMarker.bindPopup(`
      <div style="text-align: center;">
        <strong>${t("Toimitusosoite", "Delivery Address")}</strong><br>
        <small>${customerAddress}</small><br>
        <small>${t("Etäisyys", "Distance")}: ${info.distance} km</small><br>
        <small>${t("Toimitusmaksu", "Delivery Fee")}: ${info.fee.toFixed(2)}€</small>
      </div>
    `);

    // Add route line
    const routeLine = L.polyline([
      [RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng],
      [info.coordinates.lat, info.coordinates.lng]
    ], {
      color: '#4f46e5',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(leafletMap);

    // Fit map to show both markers
    const group = L.featureGroup([
      L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng]),
      customerMarker,
      routeLine
    ]);
    
    leafletMap.fitBounds(group.getBounds(), { padding: [20, 20] });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t("Paikannusta ei tueta", "Geolocation not supported"));
      return;
    }

    setIsLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          const addressFromCoords = await reverseGeocode(latitude, longitude);
          
          if (addressFromCoords) {
            parseInitialAddress(addressFromCoords);
            await handleCalculateDelivery(addressFromCoords, latitude, longitude);
          } else {
            setError(t("Osoitetta ei voitu hakea", "Could not get address"));
          }
        } catch (error) {
          setError(t("Virhe paikannuksessa", "Error in location"));
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError(t("Paikannusta ei voitu hakea", "Could not get location"));
        setIsLoading(false);
      }
    );
  };

  // Helper functions (same as in original DeliveryMap)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDeliveryFee = (distance: number): number => {
    if (distance <= 10) {
      return Number((3.00).toFixed(2));
    } else if (distance <= 50) {
      return Number((8.00).toFixed(2));
    } else {
      return -1; // Outside delivery area
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">{t("Toimitusosoite", "Delivery Address")}</h3>
            </div>
            {!showMap && (
              <Button
                onClick={() => setShowMap(true)}
                variant="outline"
                size="sm"
              >
                <Map className="w-4 h-4 mr-2" />
                {t("Näytä kartta", "Show map")}
              </Button>
            )}
          </div>

          {/* Map display */}
          {showMap && (
            <div ref={mapRef} className="w-full h-[250px] border border-gray-200 rounded-lg bg-gray-100" />
          )}

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress">
              {t("Katuosoite", "Street Address")} *
            </Label>
            <div className="relative">
              <Input
                id="streetAddress"
                value={addressData.streetAddress}
                onChange={(e) => handleStreetAddressChange(e.target.value)}
                onFocus={() => addressData.streetAddress.length > 3 && setShowSuggestions(true)}
                placeholder={t("Esim. Keskuskatu 15 A 2", "e.g. Main Street 15 A 2")}
                required
              />
              
              {/* Address suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {[suggestion.address?.house_number, suggestion.address?.road].filter(Boolean).join(' ')}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {suggestion.display_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Postal Code and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">
                {t("Postinumero", "Postal Code")} *
              </Label>
              <Input
                id="postalCode"
                value={addressData.postalCode}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                placeholder={t("Esim. 00100", "e.g. 00100")}
                maxLength={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">
                {t("Kaupunki", "City")} *
              </Label>
              <Input
                id="city"
                value={addressData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder={t("Esim. Helsinki", "e.g. Helsinki")}
                required
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex-shrink-0"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {t("Nykyinen sijainti", "Current location")}
            </Button>
            
            <Button
              onClick={() => handleCalculateDelivery()}
              disabled={isLoading || !addressData.streetAddress || !addressData.city}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isLoading ? t("Laskee...", "Calculating...") : t("Laske toimitusmaksu", "Calculate delivery fee")}
            </Button>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Delivery info */}
          {deliveryInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{deliveryInfo.distance} km</div>
                <div className="text-sm text-gray-600">{t("Etäisyys", "Distance")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{deliveryInfo.fee.toFixed(2)}€</div>
                <div className="text-sm text-gray-600">{t("Toimitusmaksu", "Delivery Fee")}</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  {deliveryInfo.zone}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">{t("Toimitus-alue", "Delivery Zone")}</div>
              </div>
            </div>
          )}

          {/* Address preview */}
          {addressData.fullAddress && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t("Täydellinen osoite:", "Complete address:")}
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {addressData.fullAddress}
              </div>
              {deliveryInfo && (
                <div className="flex items-center space-x-2 mt-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {t("Toimitus laskettu", "Delivery calculated")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Delivery zones info */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">{t("Toimitusalueet", "Delivery Zones")}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("Kuljetusalue 0 - 10km", "Delivery zone 0 - 10km")}</span>
                <span className="font-medium">{t("3,00 €", "3.00 €")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("Kuljetusalue yli 10km", "Delivery zone over 10km")}</span>
                <span className="font-medium">{t("8,00 €", "8.00 €")}</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {t("* Yli 10km toimituksissa minimitilaus 20,00 €", "* For deliveries over 10km, minimum order €20.00")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
