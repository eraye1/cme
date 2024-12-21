import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { termsApi } from '../../api/terms';
import { LoadingOverlay } from '@mantine/core';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function TermsGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTerms = async () => {
      try {
        // Check cache first
        const cachedAcceptance = localStorage.getItem('tosAccepted');
        const cachedTimestamp = localStorage.getItem('tosAcceptedAt');
        const cachedVersion = localStorage.getItem('tosVersion');
        
        // If we have valid cache that's not expired
        if (cachedAcceptance === 'true' && cachedTimestamp && cachedVersion === '1.0') {
          const cacheAge = Date.now() - new Date(cachedTimestamp).getTime();
          
          // If cache is fresh, use it
          if (cacheAge < CACHE_DURATION) {
            setLoading(false);
            return;
          }
        }

        // Cache miss or expired, check with server
        const { hasAccepted } = await termsApi.getTermsStatus();
        
        if (hasAccepted) {
          // Update cache
          localStorage.setItem('tosAccepted', 'true');
          localStorage.setItem('tosAcceptedAt', new Date().toISOString());
          localStorage.setItem('tosVersion', '1.0');
        } else if (location.pathname !== '/terms') {
          navigate('/terms', { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      } catch (error) {
        console.error('Failed to check terms status:', error);
        // On error, fall back to cache if available
        if (localStorage.getItem('tosAccepted') === 'true') {
          console.log('Using cached ToS acceptance due to API error');
        } else {
          // If no cache and API error, assume not accepted
          navigate('/terms', {
            state: { from: location.pathname },
            replace: true
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkTerms();
  }, [navigate, location]);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return <>{children}</>;
} 