/**
 * Thin wrapper over Supabase Auth. Throws a friendly error when accounts are not
 * configured (guest-only mode).
 */

import { supabase } from '@/lib/supabase'

const NOT_CONFIGURED = 'Accounts are not set up for this deployment yet.'

export const authService = {
  signUp: async (email: string, password: string, displayName: string): Promise<void> => {
    if (!supabase) throw new Error(NOT_CONFIGURED)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw error
  },

  signIn: async (email: string, password: string): Promise<void> => {
    if (!supabase) throw new Error(NOT_CONFIGURED)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  signInWithMagicLink: async (email: string): Promise<void> => {
    if (!supabase) throw new Error(NOT_CONFIGURED)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
  },

  signOut: async (): Promise<void> => {
    if (supabase) await supabase.auth.signOut()
  },
}
