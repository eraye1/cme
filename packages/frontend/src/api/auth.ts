import { api } from './index';
import type { AuthTokens, LoginCredentials, SignUpResponse, User } from '../types/auth';
import { storage } from '../utils/storage';
import { isValidToken } from '../utils/token';
import { LicenseType } from '../types/auth';

// Add token to all requests
api.interceptors.request.use((config) => {
  const { accessToken } = storage.getTokens();
  
  if (accessToken && isValidToken(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

export interface SignupData {
  email: string;
  password: string;
  name: string;
  licenseNumber?: string;
  licenseType?: LicenseType;
  states?: string[];
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthTokens>('/auth/login', credentials);
    
    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Invalid token response');
    }
    
    if (!isValidToken(data.accessToken)) {
      throw new Error('Invalid access token received');
    }
    
    const stored = storage.setTokens(data.accessToken, data.refreshToken);
    if (!stored) {
      throw new Error('Failed to store tokens');
    }
    
    return data;
  },

  logout: async () => {
    const { accessToken, refreshToken } = storage.getTokens();
    if (accessToken && refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } finally {
        storage.clearTokens();
      }
    }
  },

  refresh: async () => {
    const { refreshToken } = storage.getTokens();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const { data } = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
    
    const stored = storage.setTokens(data.accessToken, data.refreshToken);
    if (!stored) {
      throw new Error('Failed to store refreshed tokens');
    }
    
    return data;
  },

  getProfile: () => api.get<User>('/auth/profile'),

  signup: async (data: SignupData): Promise<SignUpResponse> => {
    try {
      const response = await api.post<SignUpResponse>('/auth/signup', data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('An account with this email already exists');
      }
      throw error;
    }
  },

  updateProfile: async (data: { states?: string[]; licenseType?: LicenseType }) => {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },
};

// Token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await authApi.refresh();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
); 