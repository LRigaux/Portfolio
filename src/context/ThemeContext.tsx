'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark';
type ThemeContextType = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark' });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  // Initialiser le thème sombre au chargement
  useEffect(() => {
    // Appliquer la classe dark au document
    document.documentElement.classList.add('dark');
    // Mettre à jour le thème dans le localStorage
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 