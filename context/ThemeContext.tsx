'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('late90s_theme') as Theme | null;

    const getInitialTheme = (): Theme => {
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // On mobile phones: default to white (light) or system theme
      const isMobile =
        typeof window !== 'undefined' &&
        (window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
      const systemPrefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (isMobile) {
        // Mobile phones default to white (light mode) unless system explicitly requests dark
        return systemPrefersDark ? 'dark' : 'light';
      }
      return 'dark';
    };

    const initial = getInitialTheme();
    setThemeState(initial);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(initial);

    // Listen to mobile system theme changes dynamically
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const userSaved = localStorage.getItem('late90s_theme');
        if (!userSaved) {
          const isMobileDevice =
            window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
          if (isMobileDevice) {
            const sysTheme: Theme = e.matches ? 'dark' : 'light';
            setThemeState(sysTheme);
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(sysTheme);
          }
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('late90s_theme', newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
