import React, { createContext, useContext, useState, useEffect } from "react";

const DashboardThemeContext = createContext();

export const DashboardThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("dashboard-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);
    document.documentElement.setAttribute("data-dashboard-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
};

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error("useDashboardTheme must be used within a DashboardThemeProvider");
  }
  return context;
};

export default DashboardThemeContext;
