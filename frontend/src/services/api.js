import axios from "axios";
import { supabase } from "../lib/supabase";

export const isApiConfigured = Boolean(import.meta.env.VITE_API_URL);

if (!isApiConfigured && import.meta.env.DEV) {
  console.warn(
    "[API Configuration Warning] VITE_API_URL is missing in environment variables. Defaulting to http://localhost:5001/api/v1 for development."
  );
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001/api/v1" : "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach Supabase Bearer token dynamically
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn("Failed to retrieve Supabase session for API request:", err.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("API request unauthorized (401). Token may be expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
