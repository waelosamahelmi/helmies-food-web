import { createContext, useContext, useState, useEffect } from "react";

type Language = "fi" | "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (fiText: string, enText?: string, arText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fi");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    const validLanguages = ["fi", "en", "ar"];
    
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (fiText: string, enText?: string, arText?: string) => {
    if (language === "en" && enText) {
      return enText;
    }
    if (language === "ar" && arText) {
      return arText;
    }
    return fiText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
