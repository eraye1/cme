import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AuthState, User, LoginCredentials, SignupData } from '../../types/auth';
import { authApi } from '../../api/auth';
import { useTokenMonitor } from '../../hooks/useTokenMonitor';
import { storage } from '../../utils/storage';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_USER' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_USER':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Synchronize auth state with token presence
  useEffect(() => {
    const { accessToken } = storage.getTokens();
    console.log('[AuthProvider] Initial token check:', { hasToken: !!accessToken });
    
    if (!accessToken) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: user } = await authApi.getProfile();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('[AuthProvider] Failed to initialize auth:', error);
        dispatch({ type: 'CLEAR_USER' });
      }
    };

    initializeAuth();
  }, []); // Run only on mount

  console.log('[AuthProvider] Current state:', state);

  const refreshUser = useCallback(async () => {
    try {
      console.log('[AuthProvider] Refreshing user profile');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('[AuthProvider] No token found during refresh');
        dispatch({ type: 'CLEAR_USER' });
        return;
      }

      dispatch({ type: 'SET_LOADING' });
      const { data: user } = await authApi.getProfile();
      console.log('[AuthProvider] User profile refreshed:', user);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('[AuthProvider] Error refreshing user:', error);
      // Only clear user if it's an auth error
      if (error.response?.status === 401) {
        dispatch({ type: 'CLEAR_USER' });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to refresh user' 
        });
      }
    }
  }, []);

  async function login(credentials: LoginCredentials) {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // First, get tokens
      const tokens = await authApi.login(credentials);
      
      // Then store them synchronously
      const stored = storage.setTokens(tokens.accessToken, tokens.refreshToken);
      if (!stored) {
        throw new Error('Failed to store auth tokens');
      }
      
      // Finally, get the user profile
      const { data: user } = await authApi.getProfile();
      dispatch({ type: 'SET_USER', payload: user });
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'CLEAR_USER' });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'CLEAR_USER' });
    }
  }

  async function signup(data: SignupData) {
    try {
      dispatch({ type: 'SET_LOADING' });
      await authApi.signup(data);
      await refreshUser();
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Signup failed' 
      });
      throw error;
    }
  }

  // Add cleanup effect
  useEffect(() => {
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, login, logout, refreshUser, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 