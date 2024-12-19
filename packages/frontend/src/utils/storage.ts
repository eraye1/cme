import { isValidToken } from './token';

const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const;

class TokenStorage {
  private storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;
  }

  setTokens(accessToken: string, refreshToken: string): boolean {
    try {
      if (!accessToken || !refreshToken) {
        console.error('[Storage] Attempted to store invalid tokens');
        return false;
      }

      if (!isValidToken(accessToken)) {
        console.error('[Storage] Attempted to store invalid access token');
        return false;
      }

      this.storage.setItem(TOKEN_KEYS.ACCESS, accessToken);
      this.storage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
      
      // Verify storage was successful
      const storedAccess = this.storage.getItem(TOKEN_KEYS.ACCESS);
      const storedRefresh = this.storage.getItem(TOKEN_KEYS.REFRESH);
      
      return storedAccess === accessToken && storedRefresh === refreshToken;
    } catch (error) {
      console.error('[Storage] Failed to store tokens:', error);
      return false;
    }
  }

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    try {
      const accessToken = this.storage.getItem(TOKEN_KEYS.ACCESS);
      const refreshToken = this.storage.getItem(TOKEN_KEYS.REFRESH);

      // Validate access token if present
      if (accessToken && !isValidToken(accessToken)) {
        console.warn('[Storage] Found invalid access token, clearing storage');
        return { accessToken: null, refreshToken: null };
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('[Storage] Failed to get tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  clearTokens(): boolean {
    try {
      this.storage.removeItem(TOKEN_KEYS.ACCESS);
      this.storage.removeItem(TOKEN_KEYS.REFRESH);
      return true;
    } catch (error) {
      console.error('[Storage] Failed to clear tokens:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    const { accessToken } = this.getTokens();
    return !!accessToken && isValidToken(accessToken);
  }
}

export const storage = new TokenStorage(); 