import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );

  const toggleTheme = () => {
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Custom hook for backwards compatibility
export function useColorScheme() {
  const context = useContext(ThemeContext);
  const systemColorScheme = useSystemColorScheme();

  if (context === undefined) {
    // Fallback to system color scheme if not within ThemeProvider
    return systemColorScheme;
  }
  return context.colorScheme;
}
