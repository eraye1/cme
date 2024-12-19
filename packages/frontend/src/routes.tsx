import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { LandingPage } from './pages/Landing';
import { Signup } from './pages/Signup';
import { AuthProvider } from './features/auth/AuthContext';
import { Dashboard } from './pages/Dashboard';
import Documents from './pages/Documents';
import { Credits } from './pages/Credits';

// Lazy load the Requirements page
const Requirements = React.lazy(() => import('./pages/Requirements'));

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: '/app',
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'credits',
            element: <Credits />,
          },
          {
            path: 'documents',
            element: <Documents />,
          },
          {
            path: 'requirements',
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Requirements />
              </React.Suspense>
            ),
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]); 