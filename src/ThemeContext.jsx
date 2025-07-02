// ThemeContext.jsx

import './styles/theme.css';
import { createContext, useEffect, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme_preference') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('theme_preference', theme);
    document.body.className = theme ? 'dark-theme' : 'light-theme';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);