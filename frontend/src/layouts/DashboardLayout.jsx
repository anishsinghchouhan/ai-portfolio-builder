import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { useDashboardTheme } from "../context/DashboardThemeContext";
import { ROUTES } from "../constants/routes";
import "../pages/dashboard/DashboardHomePage.css";

export const DashboardLayout = () => {
  const { theme, setTheme } = useDashboardTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Close mobile drawer on route changes
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  // Derive active menu item from current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/upload")) return "resume";
    if (
      path.startsWith("/dashboard/portfolio") ||
      path.startsWith("/dashboard/builder") ||
      path.startsWith("/dashboard/themes") ||
      path.startsWith("/dashboard/publish")
    ) {
      return "portfolio";
    }
    if (path.startsWith("/dashboard/templates")) return "templates";
    if (path.startsWith("/dashboard/analytics")) return "analytics";
    if (path.startsWith("/dashboard/settings")) return "settings";
    if (path.startsWith("/dashboard/profile")) return "profile";
    return "dashboard";
  };

  // Derive breadcrumb path from current route
  const getBreadcrumbPath = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/portfolio")) return ["Dashboard", "Portfolio"];
    if (path.startsWith("/dashboard/upload")) return ["Dashboard", "Resume & AI"];
    if (path.startsWith("/dashboard/builder")) return ["Dashboard", "Portfolio Builder"];
    if (path.startsWith("/dashboard/themes")) return ["Dashboard", "Theme Customization"];
    if (path.startsWith("/dashboard/publish")) return ["Dashboard", "Publish & Domain"];
    if (path.startsWith("/dashboard/templates")) return ["Dashboard", "Templates"];
    if (path.startsWith("/dashboard/analytics")) return ["Dashboard", "Analytics"];
    if (path.startsWith("/dashboard/settings")) return ["Dashboard", "Settings"];
    if (path.startsWith("/dashboard/profile")) return ["Dashboard", "Profile"];
    return ["Dashboard", "Overview"];
  };

  const handleMenuSelect = (id) => {
    const routeMap = {
      dashboard: ROUTES.DASHBOARD,
      portfolio: ROUTES.DASHBOARD_PORTFOLIO,
      resume: ROUTES.DASHBOARD_UPLOAD,
      templates: ROUTES.DASHBOARD_TEMPLATES,
      analytics: ROUTES.DASHBOARD_ANALYTICS,
      settings: ROUTES.DASHBOARD_SETTINGS,
      profile: ROUTES.DASHBOARD_PROFILE,
      billing: ROUTES.DASHBOARD_SETTINGS,
      help: ROUTES.DASHBOARD,
    };
    const targetRoute = routeMap[id];
    if (targetRoute) {
      setIsMobileOpen(false);
      navigate(targetRoute);
    }
  };

  return (
    <div className={`dashboard-root ${theme}`}>
      {/* Background Mesh Glows */}
      <div className="dash-bg-mesh" />
      <div className="dash-bg-glow" />

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Persistent Dashboard Sidebar */}
      <Sidebar
        activeItem={getActiveItem()}
        onSelectMenuItem={handleMenuSelect}
        isMobileOpen={isMobileOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
        onLogout={() => navigate(ROUTES.LOGIN)}
      />

      {/* Main Layout Area */}
      <div className={`dash-main-layout flex-1 min-w-0 ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Persistent Dashboard Top Navigation Header */}
        <Header
          breadcrumbPath={getBreadcrumbPath()}
          isMobileOpen={isMobileOpen}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
          onQuickAdd={() => navigate(ROUTES.DASHBOARD_UPLOAD)}
          onAiSearch={() => navigate(ROUTES.DASHBOARD_UPLOAD)}
          onOpenNotifications={() => navigate(ROUTES.DASHBOARD_SETTINGS)}
          onThemeToggle={(newTheme) => setTheme(newTheme)}
          onLogout={() => navigate(ROUTES.LOGIN)}
        />

        {/* Dynamic Nested Dashboard Page Content */}
        <main className="dash-content-body flex-1 min-w-0 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
