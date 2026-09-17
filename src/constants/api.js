export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    VERIFY_EMAIL: "/api/auth/verify-email",
    VERIFY_2FA: "/api/auth/verify-2fa",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  RESUME: {
    UPLOAD: "/api/resume/upload",
    PARSE: "/api/resume/parse",
    ANALYSIS: "/api/resume/analysis",
    HISTORY: "/api/resume/history",
  },
  PORTFOLIO: {
    GET: "/api/portfolio",
    UPDATE_SECTION: "/api/portfolio/section",
    UPDATE_THEME: "/api/portfolio/theme",
    PUBLISH: "/api/portfolio/publish",
  },
  ANALYTICS: {
    SUMMARY: "/api/analytics/summary",
    VISITORS: "/api/analytics/visitors",
    EXPORT: "/api/analytics/export",
  },
  USER: {
    PROFILE: "/api/user/profile",
    SECURITY: "/api/user/security",
    NOTIFICATIONS: "/api/user/notifications",
    BILLING: "/api/user/billing",
  },
  ADMIN: {
    STATS: "/api/admin/stats",
    USERS: "/api/admin/users",
    TEMPLATES: "/api/admin/templates",
    TICKETS: "/api/admin/tickets",
    REVENUE: "/api/admin/revenue",
  },
};

export default API_ENDPOINTS;
