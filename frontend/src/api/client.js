import axios from "axios";

// Compute base API URL from environment variable, fallback to relative /api for local dev proxy
const rawApiUrl = import.meta.env.VITE_API_URL || "";
const baseURL = rawApiUrl ? `${rawApiUrl.replace(/\/$/, "")}/api` : "/api";

const api = axios.create({
  baseURL,
});

export default api;
