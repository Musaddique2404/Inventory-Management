import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppProviders } from './app/providers.jsx'
import { AppRoutes } from './app/routes.jsx'
import { ScrollToTop } from './app/ScrollToTop.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { AppShell } from './components/layout/AppShell.jsx'
import Login from './pages/Login.jsx'
import { ROUTES } from './lib/nav.js'

/**
 * Composition root, and deliberately nothing else:
 *
 *   router → providers → { login | gate → shell → routes }
 *
 * The split at the top level is what lets `/login` be a full-bleed splash: it
 * renders on its own, outside the sidebar AppShell, while every other path is
 * wrapped in the shell.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <ScrollToTop />
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppShell>
                  <AppRoutes />
                </AppShell>
              </RequireAuth>
            }
          />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  )
}

/** Gate for the app: no session → back to the splash, remembering where to return. */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />
}

/** Inverse gate for the splash: an existing session skips straight to the app. */
function RedirectIfAuthed({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  return isAuthenticated ? <Navigate to={location.state?.from ?? ROUTES.dashboard} replace /> : children
}
