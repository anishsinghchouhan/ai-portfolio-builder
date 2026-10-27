// Centralized route paths for the AI Portfolio Builder

export const ROUTES = {
  // Public Routes
  HOME: "/",
  PRICING: "/pricing",
  TEMPLATES: "/templates",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  AUTH_CALLBACK: "/auth/callback",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  REFUND: "/refund-policy",
  CONTACT: "/contact",

  // Protected Dashboard Routes
  DASHBOARD: "/dashboard",
  DASHBOARD_UPLOAD: "/dashboard/upload",
  DASHBOARD_TEMPLATES: "/dashboard/templates",
  DASHBOARD_BUILDER: "/dashboard/builder/:portfolioId",
  DASHBOARD_THEMES: "/dashboard/themes/:portfolioId",
  DASHBOARD_PUBLISH: "/dashboard/publish/:portfolioId",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_BILLING: "/dashboard/billing",

  // Admin Route
  ADMIN: "/admin",

  // Dynamic Public Portfolio (must be mounted last)
  PUBLIC_PORTFOLIO: "/:slug",
};

// Helper builders for parameterized routes
export const getBuilderPath = (portfolioId) => `/dashboard/builder/${portfolioId}`;
export const getThemesPath = (portfolioId) => `/dashboard/themes/${portfolioId}`;
export const getPublishPath = (portfolioId) => `/dashboard/publish/${portfolioId}`;
export const getPublicPortfolioPath = (slug) => `/${slug}`;

// System reserved slugs that cannot be claimed as public portfolio URLs
export const RESERVED_SLUGS = [
  "login",
  "signup",
  "dashboard",
  "admin",
  "api",
  "pricing",
  "templates",
  "settings",
  "profile",
  "forgot-password",
  "reset-password",
  "auth",
  "home",
  "landing",
  "upload",
  "builder",
  "themes",
  "publish",
  "analytics",
  "verify",
  "2fa",
  "twofa",
  "terms",
  "privacy",
  "refund-policy",
  "contact",
  "about",
  "help",
  "blog",
  "billing",
];

export const isReservedSlug = (slug) => {
  if (!slug) return false;
  return RESERVED_SLUGS.includes(slug.toLowerCase().trim());
};

export default ROUTES;
