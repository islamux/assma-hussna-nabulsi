"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "light" | "dark";

interface SettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  theme: "light",
  toggleTheme: () => {},
  fontSize: 18,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedFontSize = localStorage.getItem("fontSize");

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--font-size-base", `${fontSize}px`);
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const increaseFontSize = () => setFontSize((s) => Math.min(s + 2, 28));
  const decreaseFontSize = () => setFontSize((s) => Math.max(s - 2, 14));

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
