import axios from 'axios';
import { useAuthStore } from '../store';

const API_URL = ''; // Relative path to proxy through server.ts

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding JWT token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling 401 and refreshing token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // In a real app, you'd call your refresh token endpoint
        // const refreshToken = useAuthStore.getState().refreshToken;
        // const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
        // useAuthStore.getState().setAuth(useAuthStore.getState().user, data.accessToken);
        // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        // return apiClient(originalRequest);
        
        // For now, if 401, just logout
        useAuthStore.getState().logout();
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
