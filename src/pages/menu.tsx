import { useState, useEffect } from "react";
import { useCategories, useMenuItems } from "@/hooks/use-menu";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemDetailModal } from "@/components/item-detail-modal";
import { CartModal } from "@/components/cart-modal";
import { CheckoutModal } from "@/components/checkout-modal";
import { RestaurantClosedModal } from "@/components/restaurant-closed-modal";
import { UniversalHeader } from "@/components/universal-header";
import { MobileNav } from "@/components/mobile-nav";
import { RestaurantStatusHeader } from "@/components/restaurant-status-header";
import { 
  Search, 
  Leaf, 
  Wheat, 
  Heart, 
  Pizza,
  UtensilsCrossed,
  Beef,
  Fish,
  Coffee,
  Beer,
  IceCream,
  Salad,
  ChefHat,
  Sandwich,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { isOnlineOrderingAvailable, getRestaurantStatus } from "@/lib/business-hours";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";

export default function Menu() {
  const { t } = useLanguage();
  const { data: categories } = useCategories();
  const { data: menuItems, isLoading } = useMenuItems();
  const { addItem } = useCart();
  const { config } = useRestaurantSettings();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [isOrderingAvailable, setIsOrderingAvailable] = useState(true); // Start optimistic

  // Check ordering availability
  useEffect(() => {
    const checkOrderingStatus = () => {
      if (config) {
        console.log('🔍 Menu: Checking ordering status', {
          isBusy: config.isBusy,
          isOnlineOrderingAvailable: isOnlineOrderingAvailable(config)
        });
        
        // Check if restaurant is busy
        if (config.isBusy) {
          console.log('⚠️ Menu: Restaurant is BUSY - disabling orders');
          setIsOrderingAvailable(false);
          if (!showClosedModal) {
            setShowClosedModal(true);
          }
          return;
        }
        
        const available = isOnlineOrderingAvailable(config);
        setIsOrderingAvailable(available);
        
        // Show closed modal only if we have config and it's definitely closed
        if (!available && !showClosedModal) {
          setShowClosedModal(true);
        }
      }
    };

    checkOrderingStatus();
    
    // Check every minute
    const interval = setInterval(checkOrderingStatus, 60000);
    
    return () => clearInterval(interval);
  }, [showClosedModal, config]);

  const handleCartOpen = () => {
    if (!isOrderingAvailable) {
      setShowClosedModal(true);
      return;
    }
    setIsCartOpen(true);
  };
  
  const handleCartClose = () => setIsCartOpen(false);
  const handleCheckoutOpen = () => {
    if (!isOrderingAvailable) {
      setShowClosedModal(true);
      return;
    }
    setIsCheckoutOpen(true);
  };
  
  const handleCheckoutClose = () => setIsCheckoutOpen(false);
  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const filteredItems = menuItems?.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.categoryId?.toString() === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  }) || [];

  const handleItemClick = (item: any) => {
    if (!isOrderingAvailable) {
      setShowClosedModal(true);
      return;
    }
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleAddToCart = (item: any, quantity: number, size?: string, toppings?: string[], specialInstructions?: string, toppingsPrice?: number, sizePrice?: number) => {
    if (!isOrderingAvailable) {
      setShowClosedModal(true);
      return;
    }
    addItem(item, quantity, size, toppings, specialInstructions, toppingsPrice, sizePrice);
    setShowItemModal(false);
  };

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(2)} €`;
  };

  const isPizza = (categoryId: number | null) => {
    if (!categoryId) return false;
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name.toLowerCase().includes('pizza') || false;
  };

  // Category icon mapping
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('pizza')) return Pizza;
    if (name.includes('kebab')) return Beef;
    if (name.includes('kana') || name.includes('chicken')) return ChefHat;
    if (name.includes('burger')) return Sandwich;
    if (name.includes('salaatti') || name.includes('salad')) return Salad;
    if (name.includes('juomat') || name.includes('drink')) return Coffee;
    if (name.includes('olut') || name.includes('beer')) return Beer;
    if (name.includes('jälkiruoka') || name.includes('dessert')) return IceCream;
    if (name.includes('kala') || name.includes('fish')) return Fish;
    return UtensilsCrossed;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
        <MobileNav />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-6 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <UniversalHeader onCartClick={handleCartOpen} />
      
      {/* Page Header */}
      <div className="bg-white dark:bg-stone-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t("Menu", "Menu")}
          </h1>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t("Hae ruokia...", "Search food...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-lg py-3"
            />
          </div>
          
          {/* Category Filter with Icons */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              {t("Kategoriat", "Categories")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="flex flex-col items-center p-4 h-auto space-y-2"
                style={selectedCategory === "all" ? {
                  backgroundColor: config?.theme.secondary,
                  borderColor: config?.theme.secondary,
                  color: 'white'
                } : {}}
                onClick={() => setSelectedCategory("all")}
              >
                <UtensilsCrossed className="w-6 h-6" />
                <span className="text-xs font-medium">
                  {t("Kaikki", "All")}
                </span>
              </Button>
              
              {categories?.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                    className="flex flex-col items-center p-4 h-auto space-y-2"
                    style={selectedCategory === category.id.toString() ? {
                      backgroundColor: config?.theme.secondary,
                      borderColor: config?.theme.secondary,
                      color: 'white'
                    } : {}}
                    onClick={() => setSelectedCategory(category.id.toString())}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {category.name.replace(/🍕😍|🥗|🍗|🍔|🥤/, '').trim()}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Status */}
      <RestaurantStatusHeader />

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredItems.length > 0 ? (
              t(
                `Näytetään ${filteredItems.length} tuotetta`, 
                `Showing ${filteredItems.length} items`
              )
            ) : (
              t("Ei tuloksia hakuehdoilla", "No results found")
            )}
          </p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {t("Ei tuloksia", "No results found")}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {t("Kokeile muuttaa hakuehtoja tai valitse toinen kategoria", "Try changing your search terms or select a different category")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                  isOrderingAvailable 
                    ? "hover:shadow-xl hover:scale-105" 
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={item.imageUrl || "/placeholder-food.jpg"}
                    alt={item.name}
                    className={`w-full h-full object-cover ${!isOrderingAvailable ? 'grayscale' : ''}`}
                    loading="lazy"
                  />
                  
                  {/* Closed overlay */}
                  {!isOrderingAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">
                          {t("Tilaukset suljettu", "Orders closed")}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {item.offerPercentage && (
                    <Badge 
                      className="absolute top-3 right-3 text-white text-sm px-2 py-1"
                      style={{ backgroundColor: config?.theme.warning }}
                    >
                      -{item.offerPercentage}%
                    </Badge>
                  )}
                  
                  {/* Dietary badges */}
                  <div className="absolute top-3 left-3 flex space-x-1">
                    {item.isVegetarian && (
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <Leaf className="w-3 h-3" />
                      </div>
                    )}
                    {item.isVegan && (
                      <div className="bg-green-600 text-white rounded-full p-1">
                        <Heart className="w-3 h-3" />
                      </div>
                    )}
                    {item.isGlutenFree && (
                      <div className="bg-amber-500 text-white rounded-full p-1">
                        <Wheat className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.offerPrice ? (
                        <>
                          <span 
                            className="text-lg font-bold"
                            style={{ color: config?.theme.warning }}
                          >
                            {formatPrice(item.offerPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                    
                    {item.categoryId && isPizza(item.categoryId) && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                        {t("Pizza", "Pizza")}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart and Checkout Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onCheckout={handleCheckoutOpen}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        onBack={handleBackToCart}
      />

      {/* Closed Restaurant Modal */}
      <RestaurantClosedModal
        isOpen={showClosedModal}
        onClose={() => setShowClosedModal(false)}
      />
    </div>
  );
}