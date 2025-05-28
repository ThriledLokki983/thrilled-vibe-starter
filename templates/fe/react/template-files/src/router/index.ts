import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layouts/MainLayout'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
