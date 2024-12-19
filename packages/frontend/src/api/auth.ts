import { api } from './index';
import type { AuthTokens, LoginCredentials, User } from '../types/auth';
import { storage } from '../utils/storage';
import { isValidToken } from '../utils/token';

// Add token to all requests
api.interceptors.request.use((config) => {
  const { accessToken } = storage.getTokens();
  console.log('[API] Request interceptor:', config.url);
  
  if (accessToken && isValidToken(accessToken)) {
    console.log('[API] Adding valid token to request');
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    console.log('[AuthAPI] Attempting login');
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
    
    console.log('[AuthAPI] Login successful, tokens stored');
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

  signup: async (data: SignupData) => {
    const { data: tokens } = await api.post<AuthTokens>('/auth/signup', data);
    const stored = storage.setTokens(tokens.accessToken, tokens.refreshToken);
    if (!stored) {
      throw new Error('Failed to store tokens during signup');
    }
    return tokens;
  },
};

// Token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('[API] Response error:', error.config?.url, error.response?.status);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[API] Attempting token refresh...');
      originalRequest._retry = true;

      try {
        const { data } = await authApi.refresh();
        console.log('[API] Token refreshed successfully');
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
); 