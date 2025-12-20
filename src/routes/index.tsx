import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layout/dashboard-layout';
import ProtectedRoute from '@/components/auth/protected-route';
import AuthLayout from '@/layout/auth-layout';

// Pages
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import DashboardPage from '@/pages/dashboard';
import ServicesPage from '@/pages/services';
import AgentsPage from '@/pages/agents';
import BookingsPage from '@/pages/bookings';
import AuditLogsPage from '@/pages/audit-logs';
import OrganizationPage from '@/pages/organization';
import NotFoundPage from '@/pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'agents',
        element: <AgentsPage />,
      },
      {
        path: 'bookings',
        element: <BookingsPage />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogsPage />,
      },
      {
        path: 'organization',
        element: <OrganizationPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/signup',
    element: <Navigate to="/auth/register" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
