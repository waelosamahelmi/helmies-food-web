import React, { createContext, useContext, useEffect, useState } from "react";
import { RESTAURANT_CONFIG } from "../config/restaurant-config";
import { useRestaurantSettings } from "../hooks/use-restaurant-settings";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const { config } = useRestaurantSettings();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply restaurant config colors as CSS custom properties
    const applyThemeColors = () => {
      const themeColors = config.theme;
      const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      // Apply light theme colors
      root.style.setProperty('--color-primary', themeColors.primary);
      root.style.setProperty('--color-secondary', themeColors.secondary);
      root.style.setProperty('--color-accent', themeColors.accent);
      root.style.setProperty('--color-success', themeColors.success);
      root.style.setProperty('--color-warning', themeColors.warning);
      root.style.setProperty('--color-error', themeColors.error);
      root.style.setProperty('--color-background', themeColors.background);
      root.style.setProperty('--color-foreground', themeColors.foreground);

      // Apply dark theme colors if available and dark mode is active
      if (isDark && themeColors.dark) {
        root.style.setProperty('--background', themeColors.dark.background);
        root.style.setProperty('--foreground', themeColors.dark.foreground);
        root.style.setProperty('--card', themeColors.dark.card);
        root.style.setProperty('--card-foreground', themeColors.dark.cardForeground);
        root.style.setProperty('--popover', themeColors.dark.popover);
        root.style.setProperty('--popover-foreground', themeColors.dark.popoverForeground);
        root.style.setProperty('--primary', themeColors.dark.primary);
        root.style.setProperty('--primary-foreground', themeColors.dark.primaryForeground);
        root.style.setProperty('--secondary', themeColors.dark.secondary);
        root.style.setProperty('--secondary-foreground', themeColors.dark.secondaryForeground);
        root.style.setProperty('--muted', themeColors.dark.muted);
        root.style.setProperty('--muted-foreground', themeColors.dark.mutedForeground);
        root.style.setProperty('--accent', themeColors.dark.accent);
        root.style.setProperty('--accent-foreground', themeColors.dark.accentForeground);
        root.style.setProperty('--destructive', themeColors.dark.destructive);
        root.style.setProperty('--destructive-foreground', themeColors.dark.destructiveForeground);
        root.style.setProperty('--border', themeColors.dark.border);
        root.style.setProperty('--input', themeColors.dark.input);
        root.style.setProperty('--ring', themeColors.dark.ring);
      }
    };

    applyThemeColors();
  }, [theme, config]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};