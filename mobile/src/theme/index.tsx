import React, { ReactNode, createContext, useContext } from 'react';
import { colors } from './colors';

type Theme = {
  colors: typeof colors;
};

const defaultTheme: Theme = {
  colors
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

