import { AuthProvider } from '../context/AuthContext.jsx'
import { ToastProvider } from '../context/ToastContext.jsx'

/**
 * The provider stack, outermost first. Auth: the router gate and the sidebar's
 * Log out read it. Toast: every form reports through it.
 */
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}
