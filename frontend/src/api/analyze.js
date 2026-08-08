import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

/**
 * Upload a resume file and return the analysis result from the backend.
 * @param {File} file - PDF or TXT resume file
 * @returns {Promise<object>} Analysis result JSON
 */
export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
