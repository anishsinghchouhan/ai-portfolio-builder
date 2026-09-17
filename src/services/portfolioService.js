import { api } from "./api";

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
  return response.data;
};

/**
 * Update portfolio content (safely preserving existing keys)
 */
export const updatePortfolio = async (id, contentUpdates) => {
  const response = await api.patch(`/portfolios/${id}`, {
    content: contentUpdates,
  });
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
    theme: themeConfig.template || currentPortfolio.theme || "modern-dark",
    content: updatedContent,
  });
  return response.data;
};

/**
 * Update portfolio publish status
 */
export const publishPortfolio = async (id, status = "published") => {
  const response = await api.patch(`/portfolios/${id}`, {
    status,
  });
  return response.data;
};

/**
 * Delete a portfolio by ID
 */
export const deletePortfolio = async (id) => {
  const response = await api.delete(`/portfolios/${id}`);
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
