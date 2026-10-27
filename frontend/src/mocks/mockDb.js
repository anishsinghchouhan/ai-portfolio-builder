// LocalStorage-backed persistent mock database engine for offline development
const DB_KEYS = {
  USER: "ai_portfolio_user",
  PORTFOLIO: "ai_portfolio_data",
  RESUMES: "ai_portfolio_resumes",
  ANALYTICS: "ai_portfolio_analytics",
};

const initialUser = {
  id: "u_101",
  fullName: "Alex Morgan",
  email: "alex.morgan@email.com",
  role: "Pro Candidate",
  isVerified: true,
  has2FA: true,
};

export const getMockUser = () => {
  const data = localStorage.getItem(DB_KEYS.USER);
  return data ? JSON.parse(data) : initialUser;
};

export const saveMockUser = (user) => {
  localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  return user;
};

export default {
  getMockUser,
  saveMockUser,
};
