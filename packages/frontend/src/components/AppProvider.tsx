import { AuthProvider } from '../features/auth/AuthContext';
import { Outlet } from 'react-router-dom';

export function AppProvider() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
} 