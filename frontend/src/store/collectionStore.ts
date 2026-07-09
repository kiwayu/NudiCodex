/**
 * Collection state: species the diver has seen (and where), plus their favourites
 * and bucket-list.
 *
 * Works in two modes with the same call sites:
 *   - Guest  (no account): state lives in localStorage (persist middleware).
 *   - Signed in: the same state is mirrored to Supabase — mutations update local
 *     state immediately (optimistic) and write through in the background, so the
 *     collection follows the user across devices.
 *
 * On sign-in, any guest data is merged up into the account (see syncOnSignIn).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RegionId } from '@/types/nudibranch'
import { supabase } from '@/lib/supabase'

export interface Sighting {
  speciesId: string
  regions: RegionId[]
  firstSeenAt: string
}

/** speciesId -> ISO timestamp the entry was added. */
type Stamped = Record<string, string>

/** Shapes of the rows read back from Supabase (untyped client). */
interface SightingRow {
  species_id: string
  regions: string[] | null
  first_seen_at: string | null
}
interface StampRow {
  species_id: string
  created_at: string | null
}

interface CollectionState {
  sightings: Record<string, Sighting>
  favourites: Stamped
  bucketList: Stamped
  /** Signed-in user id, or null for guest mode. */
  userId: string | null

  markSeen: (speciesId: string, region?: RegionId) => void
  toggleSeen: (speciesId: string) => void
  addRegion: (speciesId: string, region: RegionId) => void
  removeSeen: (speciesId: string) => void
  toggleFavourite: (speciesId: string) => void
  toggleBucket: (speciesId: string) => void
  reset: () => void

  /** Attach an account and merge guest data into it. */
  syncOnSignIn: (userId: string) => Promise<void>
  /** Detach the account and return to an empty guest collection. */
  clearForSignOut: () => void
}

const now = (): string => new Date().toISOString()

/* ---- Background writes to Supabase (no-ops in guest mode) ---- */

const cloud = () => supabase

const pushSighting = (userId: string, s: Sighting): void => {
  void cloud()?.from('sightings').upsert({
    user_id: userId,
    species_id: s.speciesId,
    regions: s.regions,
    first_seen_at: s.firstSeenAt,
  })
}

const deleteRow = (table: string, userId: string, speciesId: string): void => {
  void cloud()?.from(table).delete().match({ user_id: userId, species_id: speciesId })
}

const insertRow = (table: string, userId: string, speciesId: string): void => {
  void cloud()?.from(table).upsert({ user_id: userId, species_id: speciesId })
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      sightings: {},
      favourites: {},
      bucketList: {},
      userId: null,

      markSeen: (speciesId, region) =>
        set((state) => {
          const existing = state.sightings[speciesId]
          const regions = existing ? [...existing.regions] : []
          if (region && !regions.includes(region)) regions.push(region)
          const sighting: Sighting = {
            speciesId,
            regions,
            firstSeenAt: existing?.firstSeenAt ?? now(),
          }
          if (state.userId) pushSighting(state.userId, sighting)
          return { sightings: { ...state.sightings, [speciesId]: sighting } }
        }),

      toggleSeen: (speciesId) =>
        set((state) => {
          if (state.sightings[speciesId]) {
            const next = { ...state.sightings }
            delete next[speciesId]
            if (state.userId) deleteRow('sightings', state.userId, speciesId)
            return { sightings: next }
          }
          const sighting: Sighting = { speciesId, regions: [], firstSeenAt: now() }
          if (state.userId) pushSighting(state.userId, sighting)
          return { sightings: { ...state.sightings, [speciesId]: sighting } }
        }),

      addRegion: (speciesId, region) =>
        set((state) => {
          const existing = state.sightings[speciesId]
          const regions = existing ? [...existing.regions] : []
          if (!regions.includes(region)) regions.push(region)
          const sighting: Sighting = {
            speciesId,
            regions,
            firstSeenAt: existing?.firstSeenAt ?? now(),
          }
          if (state.userId) pushSighting(state.userId, sighting)
          return { sightings: { ...state.sightings, [speciesId]: sighting } }
        }),

      removeSeen: (speciesId) =>
        set((state) => {
          const next = { ...state.sightings }
          delete next[speciesId]
          if (state.userId) deleteRow('sightings', state.userId, speciesId)
          return { sightings: next }
        }),

      toggleFavourite: (speciesId) =>
        set((state) => {
          const next = { ...state.favourites }
          if (next[speciesId]) {
            delete next[speciesId]
            if (state.userId) deleteRow('favourites', state.userId, speciesId)
          } else {
            next[speciesId] = now()
            if (state.userId) insertRow('favourites', state.userId, speciesId)
          }
          return { favourites: next }
        }),

      toggleBucket: (speciesId) =>
        set((state) => {
          const next = { ...state.bucketList }
          if (next[speciesId]) {
            delete next[speciesId]
            if (state.userId) deleteRow('bucket_list', state.userId, speciesId)
          } else {
            next[speciesId] = now()
            if (state.userId) insertRow('bucket_list', state.userId, speciesId)
          }
          return { bucketList: next }
        }),

      reset: () =>
        set((state) => {
          const client = cloud()
          if (state.userId && client) {
            void client.from('sightings').delete().eq('user_id', state.userId)
            void client.from('favourites').delete().eq('user_id', state.userId)
            void client.from('bucket_list').delete().eq('user_id', state.userId)
          }
          return { sightings: {}, favourites: {}, bucketList: {} }
        }),

      syncOnSignIn: async (userId) => {
        const client = cloud()
        if (!client) {
          set({ userId })
          return
        }
        const local = get()

        // Push any guest rows up first so nothing is lost on first sign-in.
        const localSightings = Object.values(local.sightings)
        if (localSightings.length > 0) {
          await client.from('sightings').upsert(
            localSightings.map((s) => ({
              user_id: userId,
              species_id: s.speciesId,
              regions: s.regions,
              first_seen_at: s.firstSeenAt,
            }))
          )
        }
        const localFavs = Object.keys(local.favourites)
        if (localFavs.length > 0) {
          await client
            .from('favourites')
            .upsert(localFavs.map((species_id) => ({ user_id: userId, species_id })))
        }
        const localBucket = Object.keys(local.bucketList)
        if (localBucket.length > 0) {
          await client
            .from('bucket_list')
            .upsert(localBucket.map((species_id) => ({ user_id: userId, species_id })))
        }

        // Then read the merged truth back down.
        const [sRes, fRes, bRes] = await Promise.all([
          client.from('sightings').select('species_id, regions, first_seen_at'),
          client.from('favourites').select('species_id, created_at'),
          client.from('bucket_list').select('species_id, created_at'),
        ])

        const sightings: Record<string, Sighting> = {}
        for (const row of (sRes.data ?? []) as SightingRow[]) {
          sightings[row.species_id] = {
            speciesId: row.species_id,
            regions: (row.regions ?? []) as RegionId[],
            firstSeenAt: row.first_seen_at ?? now(),
          }
        }
        const favourites: Stamped = {}
        for (const row of (fRes.data ?? []) as StampRow[]) {
          favourites[row.species_id] = row.created_at ?? now()
        }
        const bucketList: Stamped = {}
        for (const row of (bRes.data ?? []) as StampRow[]) {
          bucketList[row.species_id] = row.created_at ?? now()
        }

        set({ userId, sightings, favourites, bucketList })
      },

      clearForSignOut: () => set({ userId: null, sightings: {}, favourites: {}, bucketList: {} }),
    }),
    {
      name: 'nudicodex-collection',
      // Persist only the collection data, never the account link.
      partialize: (state) => ({
        sightings: state.sightings,
        favourites: state.favourites,
        bucketList: state.bucketList,
      }),
    }
  )
)
