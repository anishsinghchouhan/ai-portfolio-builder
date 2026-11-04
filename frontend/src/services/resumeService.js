import { api } from "./api";
import { triggerDashboardRefresh } from "../hooks/useSummary";

/**
 * Fetch all resumes for the authenticated user
 */
export const getUserResumes = async () => {
  const response = await api.get("/resumes");
  return response.data?.data || [];
};

/**
 * Save an uploaded/parsed resume to the database
 */
export const createResumeRecord = async (resumeData) => {
  const response = await api.post("/resumes", resumeData);
  triggerDashboardRefresh();
  return response.data?.data || response.data;
};

/**
 * Delete a resume from the database
 */
export const deleteResumeRecord = async (id) => {
  const response = await api.delete(`/resumes/${id}`);
  triggerDashboardRefresh();
  return response.data;
};

