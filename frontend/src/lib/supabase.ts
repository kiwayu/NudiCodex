/**
 * Supabase client.
 *
 * Configured from Vite env vars. When they are absent the client is null and the
 * app runs in local, guest-only mode (collection kept in localStorage). This keeps
 * NudiCodex fully usable without a backend, and lets accounts layer on top when
 * the project keys are provided.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
