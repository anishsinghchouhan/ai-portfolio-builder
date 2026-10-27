import React, { createContext, useContext, useState, useEffect } from "react";

const LandingThemeContext = createContext();

export const LandingThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("landing-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (e) {
      console.warn("Could not read landing-theme from localStorage:", e);
    }
    return "dark";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-landing-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("landing-theme", theme);
    } catch (e) {
      console.warn("Could not write landing-theme to localStorage:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <LandingThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </LandingThemeContext.Provider>
  );
};

export const useLandingTheme = () => {
  const context = useContext(LandingThemeContext);
  if (!context) {
    // Return fallback if used outside Provider
    return {
      theme: "dark",
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};

export default LandingThemeContext;
