import type { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * Gate a route behind a signed-in user. Waits for the initial session check,
 * then redirects guests to the sign-in page.
 */
export const RequireAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user)
  const initialized = useAuthStore((s) => s.initialized)

  if (!initialized) {
    return <div className="page auth-loading" aria-busy="true" />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
