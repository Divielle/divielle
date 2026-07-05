import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "classic" | "nights";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isNight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "nights" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("divielle-theme") as Theme | null;
      if (stored === "classic" || stored === "nights") return stored;
    }
    return defaultTheme;
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("divielle-theme", newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "classic" ? "nights" : "classic");
  }, [theme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("classic", "nights", "light", "dark");
    root.classList.add(theme);
    // Also add dark class for nights mode to support shadcn components
    if (theme === "nights") {
      root.classList.add("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNight: theme === "nights" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
