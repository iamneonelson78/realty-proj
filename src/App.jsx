import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthSession } from './hooks/useAuthSession'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ListingsPage } from './pages/ListingsPage'
import { LeadsPage } from './pages/LeadsPage'
import { LeadDetailsPage } from './pages/LeadDetailsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

function ThemeInit() {
  const initTheme = useThemeStore((s) => s.initTheme)
  useEffect(() => { initTheme() }, [initTheme])
  return null
}

function AppRoutes() {
  useAuthSession()
  const user = useAuthStore((s) => s.user)

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/listings" element={<ProtectedRoute><Layout><ListingsPage /></Layout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Layout><LeadsPage /></Layout></ProtectedRoute>} />
      <Route path="/leads/:id" element={<ProtectedRoute><Layout><LeadDetailsPage /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInit />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
