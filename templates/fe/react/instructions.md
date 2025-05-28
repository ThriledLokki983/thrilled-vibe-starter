# Frontend Development Instructions - React Application

## 🚀 Overview
These instructions guide the creation of a highly well-structured, web and mobile-friendly React application using modern best practices and technologies.

## 📋 Tech Stack Requirements

### Core Technologies
- **React 18+** with TypeScript
- **React Query (TanStack Query v4+)** for server state management
- **Zustand** for client state management
- **React Router DOM** for routing and navigation
- **TypeScript** for type safety
- **CSS Modules** for styling
- **React Aria** for accessibility
- **Yarn** for package management (MANDATORY)

### Package Management
**Always use Yarn for package management** - never use npm or other package managers.

## 🎨 Design System - "HuisHelder" App Aesthetic

### Design Intent & Personality
The interface should feel:
- Minimal yet warm
- Luxurious but not flashy
- Smart, trustworthy, and incredibly clean
- Slightly "cosmic" and futuristic in visual language
- Highly readable and effortlessly elegant

### Color Palette - Refined, Earthy-Cosmic

#### Primary Palette
| Purpose             | Color Name           | Hex       | CSS Variable           |
| ------------------- | -------------------- | --------- | ---------------------- |
| Brand Primary       | Deep Olive Green     | `#3A4F41` | `--color-primary`      |
| Accent / CTA        | Soft Amber           | `#F4C77B` | `--color-accent`       |
| Light Background    | Bone White           | `#F8F5F0` | `--color-bg-light`     |
| Cards / Surfaces    | Warm Fog             | `#EAE6E1` | `--color-surface`      |
| Alerts / Highlights | Clay Red             | `#C25A5A` | `--color-alert`        |
| Text Primary        | Charcoal Ink         | `#2A2A2A` | `--color-text-primary` |

#### Secondary Palette
| Purpose              | Color Name      | Hex       | CSS Variable         |
| -------------------- | --------------- | --------- | -------------------- |
| Secondary UI / Hover | Slate Gray      | `#6E7673` | `--color-secondary`  |
| Divider / Line       | Muted Taupe     | `#DAD5CF` | `--color-divider`    |

### Typography System
- **Font Stack**: 'Inter', 'General Sans', 'Satoshi', system-ui, sans-serif
- **Scale**: 4pt base system (multiply by 4: 12pt, 16pt, 20pt, 24pt, 32pt, 48pt)
- **Line Height**: 1.4–1.6 for optimal readability
- **Font Weights**: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

### Spacing System
**Strict 4pt spacing system** - all measurements must be multiples of 4:
- Base unit: 4px
- Common values: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Default padding: 16–24px
- Section spacing: 32–48px

### Layout Guidelines
- **Rounded corners**: 12–16px radius
- **Shadows**: Soft, subtle elevation
- **Cards**: Elevated, lightly shadowed, airy spacing
- **Grid system**: CSS Grid or Flexbox with consistent gaps
- **Mobile-first**: Always start with mobile design

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements (Button, Input, etc.)
│   ├── forms/           # Form-specific components
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── services/            # API services and external integrations
├── stores/              # Zustand state management stores
├── router/              # React Router configuration
├── pages/               # Page components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Global styles and CSS modules
│   ├── globals.css      # Global styles and CSS variables
│   ├── components/      # Component-specific CSS modules
│   └── utils/           # Utility CSS classes
├── assets/              # Static assets (images, icons, etc.)
└── constants/           # Application constants
```

## 🔧 Setup Instructions

### 1. Project Initialization
```bash
# Create new React app with TypeScript
yarn create react-app my-app --template typescript
cd my-app

# Or for Next.js
yarn create next-app my-app --typescript --tailwind --app
cd my-app
```

### 2. Install Required Dependencies
```bash
# Core dependencies
yarn add @tanstack/react-query @tanstack/react-query-devtools
yarn add react-aria-components react-aria
yarn add zustand
yarn add react-router-dom
yarn add clsx classnames

# Development dependencies
yarn add -D @types/node
yarn add -D prettier eslint-config-prettier
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 3. Configure TypeScript
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"],
      "@/styles/*": ["styles/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## 🎨 Styling Implementation

### 1. Global CSS Variables
Create `src/styles/globals.css`:
```css
:root {
  /* Colors */
  --color-primary: #3A4F41;
  --color-accent: #F4C77B;
  --color-bg-light: #F8F5F0;
  --color-surface: #EAE6E1;
  --color-alert: #C25A5A;
  --color-text-primary: #2A2A2A;
  --color-secondary: #6E7673;
  --color-divider: #DAD5CF;
  
  /* Spacing (4pt system) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Typography */
  --font-family: 'Inter', 'General Sans', 'Satoshi', system-ui, sans-serif;
  --font-size-sm: 12px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;
  
  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.2s ease-out;
  --transition-slow: 0.3s ease-out;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-text-primary);
  background-color: var(--color-bg-light);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 2. CSS Modules Best Practices
For component-specific styles, use CSS Modules:

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: inherit;
}

.primary {
  background-color: var(--color-primary);
  color: white;
}

.primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.secondary {
  background-color: var(--color-accent);
  color: var(--color-text-primary);
}

.large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}
```

## ⚛️ React Query Implementation

### 1. Query Client Setup
Create `src/services/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 2. API Service Layer
Create `src/services/api.ts`:
```typescript
// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new ApiError(
      `API Error: ${response.statusText}`,
      response.status,
      await response.json().catch(() => null)
    );
  }

  return response.json();
}
```

### 3. Query Hooks Pattern
Create query hooks in `src/hooks/`:
```typescript
// useProperties.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/services/api';
import type { Property, CreatePropertyData } from '@/types/property';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => apiRequest<Property[]>('/properties'),
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => apiRequest<Property>(`/properties/${id}`),
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePropertyData) =>
      apiRequest<Property>('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
```

## 🗂️ State Management with Zustand

### 1. Basic Store Setup
Create stores in `src/stores/`:
```typescript
// authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        setLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'auth-store' }
  )
);
```

### 2. UI State Store
```typescript
// uiStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      sidebarOpen: false,
      theme: 'light',
      notifications: [],
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        const newNotification = {
          ...notification,
          id,
          timestamp: new Date(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    { name: 'ui-store' }
  )
);
```

### 3. Store Integration Patterns
```typescript
// useStoreActions.ts - Custom hook for common store patterns
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useCreateProperty } from '@/hooks/useProperties';

export const useStoreActions = () => {
  const { login, logout, setLoading } = useAuthStore();
  const { addNotification } = useUIStore();
  
  const createPropertyMutation = useCreateProperty();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      // Your login logic here
      const user = await loginUser(credentials);
      login(user);
      addNotification({
        type: 'success',
        message: 'Successfully logged in!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (propertyData: any) => {
    try {
      await createPropertyMutation.mutateAsync(propertyData);
      addNotification({
        type: 'success',
        message: 'Property created successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to create property.',
      });
    }
  };

  return {
    handleLogin,
    handleCreateProperty,
    logout,
  };
};
```

## 🧭 Routing with React Router DOM

### 1. Router Setup
Create `src/router/index.tsx`:
```typescript
// router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RootLayout } from '@/components/layout/RootLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const PropertiesPage = lazy(() => import('@/pages/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('@/pages/PropertyDetailsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Wrapper component for lazy-loaded routes
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <LazyWrapper><NotFoundPage /></LazyWrapper>,
    children: [
      {
        index: true,
        element: <LazyWrapper><HomePage /></LazyWrapper>,
      },
      {
        path: 'properties',
        children: [
          {
            index: true,
            element: <LazyWrapper><PropertiesPage /></LazyWrapper>,
          },
          {
            path: ':id',
            element: <LazyWrapper><PropertyDetailsPage /></LazyWrapper>,
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyWrapper><ProfilePage /></LazyWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'login',
        element: <LazyWrapper><LoginPage /></LazyWrapper>,
      },
      {
        path: 'register',
        element: <LazyWrapper><RegisterPage /></LazyWrapper>,
      },
    ],
  },
  {
    path: '*',
    element: <LazyWrapper><NotFoundPage /></LazyWrapper>,
  },
]);
```

### 2. Protected Routes Component
```typescript
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### 3. Layout Components
```typescript
// components/layout/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import styles from './RootLayout.module.css';

export function RootLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className={clsx(styles.layout, { [styles.sidebarOpen]: sidebarOpen })}>
      <Header />
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

```typescript
// components/layout/AuthLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.authLayout}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
```

### 4. Navigation Hooks and Components
```typescript
// hooks/useNavigation.ts
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const goToProperty = useCallback((id: string) => {
    navigate(`/properties/${id}`);
  }, [navigate]);

  const goToProperties = useCallback((filters?: Record<string, string>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    navigate(`/properties?${params.toString()}`);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return {
    navigate,
    location,
    searchParams,
    goToProperty,
    goToProperties,
    goBack,
    updateSearchParams,
  };
};
```

### 5. Navigation Component
```typescript
// components/layout/Navigation.tsx
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import styles from './Navigation.module.css';

interface NavigationItem {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/profile', label: 'Profile' },
];

export function Navigation() {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigationList}>
        {navigationItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                clsx(styles.navigationLink, {
                  [styles.active]: isActive,
                })
              }
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### 6. App Router Integration
```typescript
// App.tsx
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from '@/router';
import { queryClient } from '@/services/queryClient';
import '@/styles/globals.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

## ♿ React Aria Integration

### 1. Accessible Components
Create accessible UI components using React Aria:

```typescript
// Button.tsx
import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import { clsx } from 'clsx';
import styles from './Button.module.css';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'medium', 
  className,
  children,
  ...props 
}: CustomButtonProps) {
  return (
    <AriaButton
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </AriaButton>
  );
}
```

### 2. Form Components
```typescript
// Input.tsx
import { TextField, Label, Input as AriaInput, FieldError } from 'react-aria-components';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  isRequired?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

export function Input({ 
  label, 
  name, 
  type = 'text',
  isRequired = false,
  errorMessage,
  placeholder 
}: InputProps) {
  return (
    <TextField name={name} isRequired={isRequired} className={styles.field}>
      <Label className={styles.label}>{label}</Label>
      <AriaInput 
        type={type} 
        placeholder={placeholder}
        className={styles.input}
      />
      {errorMessage && <FieldError className={styles.error}>{errorMessage}</FieldError>}
    </TextField>
  );
}
```

## 📱 Mobile-First Responsive Design

### 1. Breakpoint System
Define responsive breakpoints in CSS:
```css
/* breakpoints.css */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Mobile-first media queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 2. Responsive Component Example
```css
/* Card.module.css */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-4);
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .card {
    margin: 0 calc(-1 * var(--space-4));
    border-radius: 0;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}
```

## 🔧 Development Best Practices

### 1. Component Structure
```typescript
// StandardComponent.tsx
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './StandardComponent.module.css';

// Props interface
interface StandardComponentProps {
  children: ReactNode;
  variant?: 'default' | 'highlighted';
  isLoading?: boolean;
  className?: string;
  onAction?: () => void;
}

// Component implementation
export function StandardComponent({
  children,
  variant = 'default',
  isLoading = false,
  className,
  onAction,
}: StandardComponentProps) {
  // Early returns for loading/error states
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Event handlers
  const handleClick = () => {
    onAction?.();
  };

  // Render
  return (
    <div 
      className={clsx(
        styles.container,
        styles[variant],
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

// Default export
export default StandardComponent;
```

### 2. Custom Hooks Pattern
```typescript
// useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### 3. Error Boundaries
```typescript
// ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Oops, there was an error!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🧪 Testing Strategy

### 1. Setup Testing Dependencies
```bash
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
yarn add -D jest-environment-jsdom
```

### 2. Test Utilities
```typescript
// test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 🚀 Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const PropertyDetails = lazy(() => import('./PropertyDetails'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertyDetails />
    </Suspense>
  );
}
```

### 2. Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveComputation(item),
    }));
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.computed}
        </div>
      ))}
    </div>
  );
});
```

## 📦 Build and Deployment

### 1. Environment Configuration
```bash
# .env.local
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development

# .env.production
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_ENVIRONMENT=production
```

### 2. Build Scripts
```json
{
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## ✅ Quality Checklist

Before considering the application complete, ensure:

### Functionality
- [ ] All React Query mutations invalidate relevant cache
- [ ] Zustand stores properly typed and organized
- [ ] Protected routes working correctly
- [ ] Navigation and routing function smoothly
- [ ] Loading and error states handled consistently
- [ ] Mobile navigation works smoothly
- [ ] Forms validate properly with clear error messages
- [ ] All interactive elements are keyboard accessible

### Performance
- [ ] Images optimized and lazy loaded
- [ ] Large components code-split
- [ ] Unnecessary re-renders eliminated
- [ ] Bundle size analyzed and optimized

### Accessibility
- [ ] All interactive elements focusable
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible
- [ ] Alternative text for images

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint warnings resolved
- [ ] Components properly tested
- [ ] CSS follows design system
- [ ] No console errors in production build

### Design System Compliance
- [ ] All spacing uses 4pt system
- [ ] Colors match defined palette
- [ ] Typography hierarchy consistent
- [ ] Interactive states properly styled
- [ ] Mobile-first approach maintained

## 🔧 Maintenance

### Regular Updates
```bash
# Update dependencies monthly
yarn upgrade-interactive --latest

# Check for security vulnerabilities
yarn audit

# Update TypeScript definitions
yarn add -D @types/node@latest @types/react@latest @types/react-dom@latest
```

### Monitoring
- Monitor bundle size with `yarn build` and webpack-bundle-analyzer
- Track Core Web Vitals in production
- Monitor error rates and performance metrics
- Regularly audit accessibility with axe-core

---

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Router DOM Documentation](https://reactrouter.com/en/main)
- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

This comprehensive guide ensures your React application is built with modern best practices, excellent performance, full accessibility, and a beautiful, consistent design system.