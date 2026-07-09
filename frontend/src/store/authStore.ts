/**
 * Authentication state, backed by the Supabase session.
 *
 * Supabase persists and refreshes the session itself; this store just holds the
 * current user for the UI. Session wiring lives in useAuthInit.
 */

import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  displayName: string
}

interface AuthState {
  user: AuthUser | null
  /** True once the initial session check has completed. */
  initialized: boolean
  setUser: (user: AuthUser | null) => void
  setInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (initialized) => set({ initialized }),
}))
