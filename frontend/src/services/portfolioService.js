import { api } from "./api";
import { triggerDashboardRefresh } from "../hooks/useSummary";

/**
 * Fetch all portfolios for the authenticated user
 */
export const getUserPortfolios = async () => {
  const response = await api.get("/portfolios");
  return response.data;
};

/**
 * Fetch a single portfolio by ID
 */
export const getPortfolioById = async (id) => {
  const response = await api.get(`/portfolios/${id}`);
  return response.data;
};

/**
 * Create a new portfolio
 */
export const createPortfolio = async (data = {}) => {
  const response = await api.post("/portfolios", data);
  triggerDashboardRefresh();
  return response.data;
};

/**
 * Update portfolio content (safely preserving existing keys)
 */
export const updatePortfolio = async (id, contentUpdates) => {
  const response = await api.patch(`/portfolios/${id}`, {
    content: contentUpdates,
  });
  triggerDashboardRefresh();
  return response.data;
};

/**
 * Update portfolio theme configuration (nested inside content.themeConfig)
 */
export const updatePortfolioTheme = async (id, themeConfig) => {
  // Fetch existing content to perform immutable merge
  const existing = await getPortfolioById(id);
  const currentPortfolio = existing.data || existing;
  const currentContent = currentPortfolio.content || {};

  const updatedContent = {
    ...currentContent,
    themeConfig: {
      ...(currentContent.themeConfig || {}),
      ...themeConfig,
    },
  };

  const response = await api.patch(`/portfolios/${id}`, {
    theme: themeConfig.template || currentPortfolio.theme || "dark-glass",
    content: updatedContent,
  });
  triggerDashboardRefresh();
  return response.data;
};

/**
 * Publish portfolio to live status via dedicated /publish endpoint
 */
export const publishPortfolio = async (id) => {
  const response = await api.patch(`/portfolios/${id}/publish`);
  triggerDashboardRefresh();
  return response.data;
};

/**
 * Delete a portfolio by ID
 */
export const deletePortfolio = async (id) => {
  const response = await api.delete(`/portfolios/${id}`);
  triggerDashboardRefresh();
  return response.data;
};

const portfolioService = {
  getUserPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  updatePortfolioTheme,
  publishPortfolio,
  deletePortfolio,
};

export default portfolioService;
