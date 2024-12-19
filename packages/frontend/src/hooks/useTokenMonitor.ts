import { useEffect, useRef } from 'react';
import { storage } from '../utils/storage';
import { isValidToken } from '../utils/token';

export function useTokenMonitor() {
  const lastTokens = useRef<{ accessToken: string | null; refreshToken: string | null }>({ 
    accessToken: null, 
    refreshToken: null 
  });

  useEffect(() => {
    const checkTokens = () => {
      const { accessToken, refreshToken } = storage.getTokens();
      
      // Only log if tokens have changed
      if (
        lastTokens.current.accessToken !== accessToken || 
        lastTokens.current.refreshToken !== refreshToken
      ) {
        console.log('[TokenMonitor] Tokens changed:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          isValid: accessToken ? isValidToken(accessToken) : false,
          accessTokenChanged: lastTokens.current.accessToken !== accessToken,
          refreshTokenChanged: lastTokens.current.refreshToken !== refreshToken,
        });

        lastTokens.current = { accessToken, refreshToken };
      }
    };

    checkTokens();
    const interval = setInterval(checkTokens, 1000); // Check more frequently
    return () => clearInterval(interval);
  }, []);
} 