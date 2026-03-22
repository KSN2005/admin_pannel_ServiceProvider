import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = (rawBaseUrl ? rawBaseUrl.trim().replace(/\/+$/, "") : "http://localhost:5000/api");
export const TOKEN_KEY = "adminToken";
export const REFRESH_TOKEN_KEY = "adminRefreshToken";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => localStorage.getItem(TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

const redirectToLogin = () => {
  clearAuth();
  window.location.href = "/login";
};

// Attach auth token to every request if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error?.response) {
      console.error("API Network/Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/admin/refresh-token`, {
          refreshToken,
        });

        localStorage.setItem(TOKEN_KEY, data.token);
        if (data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }

        onRefreshed(data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("API Error:", status, error.response.data);
    return Promise.reject(error);
  }
);

export const logout = () => {
  clearAuth();
  window.location.href = "/login";
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export { api };
