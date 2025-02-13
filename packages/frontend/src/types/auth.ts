import { LicenseType } from '../api/requirements';

export interface User {
  id: string;
  email: string;
  name: string;
  licenseNumber?: string;
  licenseType?: LicenseType;
  states: string[];
  specialty?: string;
  credentials: string[];
}
export interface SignUpResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  licenseNumber?: string;
  specialty?: string;
  licenseType?: LicenseType;
  states: string[];
} 