import React, { createContext, useState, useEffect } from 'react';

/**
 * Context for managing global UI Theme state (Light / Dark mode).
 * Syncs active theme attribute to <html> root and persists selection in localStorage.
 */
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Retrieve saved preference from localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Update data-theme attribute on root HTML element for CSS variable switching
    document.documentElement.setAttribute('data-theme', theme);
    // Persist choice across page reloads
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between Light and Dark themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
