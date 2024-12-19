import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { LoadingOverlay, Center, Paper, Title, Stack, Text } from '@mantine/core';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!state.isLoading) {
      setAuthChecked(true);
    }
  }, [state.isLoading]);

  console.log('[ProtectedRoute] State:', {
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    hasUser: !!state.user,
    authChecked,
    path: location.pathname
  });

  if (!authChecked || state.isLoading) {
    return (
      <Center h="100vh">
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" spacing="md">
            <Title order={3}>Loading...</Title>
            <Text size="sm" c="dimmed">
              Checking authentication status
            </Text>
            <LoadingOverlay visible />
          </Stack>
        </Paper>
      </Center>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 