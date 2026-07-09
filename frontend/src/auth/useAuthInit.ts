/**
 * Wires the Supabase auth session into the app: keeps authStore in sync and
 * triggers the collection sync/merge on sign-in (and clears it on sign-out).
 * Call once, near the app root.
 */

import { useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuthStore, type AuthUser } from '@/store/authStore'
import { useCollectionStore } from '@/store/collectionStore'

const toAuthUser = (user: User): AuthUser => {
  const meta = (user.user_metadata ?? {}) as { display_name?: string }
  const email = user.email ?? ''
  return {
    id: user.id,
    email,
    displayName: meta.display_name || email.split('@')[0] || 'Diver',
  }
}

export const useAuthInit = (): void => {
  const setUser = useAuthStore((s) => s.setUser)
  const setInitialized = useAuthStore((s) => s.setInitialized)
  const syncOnSignIn = useCollectionStore((s) => s.syncOnSignIn)
  const clearForSignOut = useCollectionStore((s) => s.clearForSignOut)

  useEffect(() => {
    if (!supabase) {
      setInitialized(true)
      return
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user
      if (user) {
        setUser(toAuthUser(user))
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          void syncOnSignIn(user.id)
        }
      } else {
        setUser(null)
        if (event === 'SIGNED_OUT') clearForSignOut()
      }
      setInitialized(true)
    })

    return () => data.subscription.unsubscribe()
  }, [setUser, setInitialized, syncOnSignIn, clearForSignOut])
}
