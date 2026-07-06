import axios from "axios";

// Debug: verify the environment variable is available
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

console.log("Axios baseURL =", api.defaults.baseURL);

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const { token } = JSON.parse(storedUser);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Handle 401s globally by logging the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;