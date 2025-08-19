import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { useRestaurant } from "@/lib/restaurant-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ShoppingCart, Moon, Sun, Menu, Globe, X } from "lucide-react";
import { Link, useLocation } from "wouter";

interface UniversalHeaderProps {
  onCartClick?: () => void;
}

export function UniversalHeader({ onCartClick }: UniversalHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { config } = useRestaurant();
  const [location] = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (isLanguageMenuOpen) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, isLanguageMenuOpen]);

  const navigationItems = [
    { href: "/", label: t("Etusivu", "Home") },
    { href: "/menu", label: t("Menu", "Menu") },
    { href: "/about", label: t("Meistä", "About") },
    { href: "/contact", label: t("Yhteystiedot", "Contact") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "default" : "ghost"}
                    className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                    style={{
                      backgroundColor: location === item.href ? config.theme.primary : undefined,
                      color: location === item.href ? 'white' : undefined
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="px-2 py-2"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              {/* Desktop Language Selection */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLanguageMenuOpen(!isLanguageMenuOpen);
                  }}
                  className="px-2 py-2 flex items-center space-x-1"
                  title={t("Vaihda kieli", "Change language")}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">
                    {language === "fi" ? "FI" : "EN"}
                  </span>
                </Button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage("fi");
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg text-sm ${
                        language === "fi" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
                      }`}
                    >
                      🇫🇮 Suomi
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage("en");
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg text-sm ${
                        language === "en" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
                      }`}
                    >
                      🇺🇸 English
                    </button>
                  </div>
                )}
              </div>

              {onCartClick && (
                <Button
                  onClick={onCartClick}
                  className="text-white px-3 py-2 flex items-center justify-center relative"
                  style={{ backgroundColor: config.theme.primary }}
                  title={t("Kori", "Cart")}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium animate-bounce">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Cart Button */}
              {onCartClick && (
                <Button
                  onClick={onCartClick}
                  className="text-white p-2 flex items-center justify-center relative"
                  style={{ backgroundColor: config.theme.primary }}
                  size="sm"
                  title={t("Kori", "Cart")}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium animate-bounce">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-2"
                title={t("Valikko", "Menu")}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-16 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={location === item.href ? "default" : "ghost"}
                      className="w-full justify-start"
                      style={{
                        backgroundColor: location === item.href ? config.theme.primary : undefined,
                        color: location === item.href ? 'white' : undefined
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                {/* Mobile Theme Toggle */}
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="w-full justify-start"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {theme === "dark" ? t("Vaalea teema", "Light theme") : t("Tumma teema", "Dark theme")}
                </Button>

                {/* Mobile Language Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("Kieli", "Language")}
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setLanguage("fi");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        language === "fi" 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      style={{
                        backgroundColor: language === "fi" ? `${config.theme.primary}20` : undefined
                      }}
                    >
                      🇫🇮 Suomi
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        language === "en" 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      style={{
                        backgroundColor: language === "en" ? `${config.theme.primary}20` : undefined
                      }}
                    >
                      🇺🇸 English
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}