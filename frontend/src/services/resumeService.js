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
 * Upload a resume PDF file (multipart/form-data, field "file")
 * @param {File} file
 * @param {Function} [onUploadProgress]
 */
export const uploadResumeFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });

  triggerDashboardRefresh();
  return response.data?.data || response.data;
};

/**
 * Trigger AI analysis of an uploaded resume
 * @param {string} id - Resume UUID
 * @param {string} [text] - Optional text override
 */
export const analyzeResume = async (id, text) => {
  const payload = text ? { text } : {};
  const response = await api.post(`/resumes/${id}/analyze`, payload);
  triggerDashboardRefresh();
  return response.data?.data || response.data;
};

/**
 * Save an uploaded/parsed resume record to the database
 */
export const createResumeRecord = async (resumeData) => {
  const response = await api.post("/resumes", resumeData);
  triggerDashboardRefresh();
  return response.data?.data || response.data;
};

/**
 * Delete a resume from the database and storage
 */
export const deleteResumeRecord = async (id) => {
  const response = await api.delete(`/resumes/${id}`);
  triggerDashboardRefresh();
  return response.data;
};
