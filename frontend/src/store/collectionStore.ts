/**
 * Collection state: which species the diver has logged, and in which regions.
 *
 * Persisted to localStorage so a diver's Dex progress survives reloads without
 * needing an account.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RegionId } from '@/types/nudibranch'

export interface Sighting {
  speciesId: string
  /** Regions where the diver has logged this species. */
  regions: RegionId[]
  firstSeenAt: string
}

interface CollectionState {
  sightings: Record<string, Sighting>
  /** Mark a species as seen, optionally recording the region of the sighting. */
  markSeen: (speciesId: string, region?: RegionId) => void
  /** Toggle the seen state of a species on or off. */
  toggleSeen: (speciesId: string) => void
  /** Add a region to an existing (or new) sighting. */
  addRegion: (speciesId: string, region: RegionId) => void
  /** Remove a species from the collection. */
  removeSeen: (speciesId: string) => void
  /** Clear the whole collection. */
  reset: () => void
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      sightings: {},

      markSeen: (speciesId, region) =>
        set((state) => {
          const existing = state.sightings[speciesId]
          const regions = existing ? [...existing.regions] : []
          if (region && !regions.includes(region)) regions.push(region)
          const sighting: Sighting = {
            speciesId,
            regions,
            firstSeenAt: existing?.firstSeenAt ?? new Date().toISOString(),
          }
          return { sightings: { ...state.sightings, [speciesId]: sighting } }
        }),

      toggleSeen: (speciesId) =>
        set((state) => {
          if (state.sightings[speciesId]) {
            const next = { ...state.sightings }
            delete next[speciesId]
            return { sightings: next }
          }
          const sighting: Sighting = {
            speciesId,
            regions: [],
            firstSeenAt: new Date().toISOString(),
          }
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
            firstSeenAt: existing?.firstSeenAt ?? new Date().toISOString(),
          }
          return { sightings: { ...state.sightings, [speciesId]: sighting } }
        }),

      removeSeen: (speciesId) =>
        set((state) => {
          const next = { ...state.sightings }
          delete next[speciesId]
          return { sightings: next }
        }),

      reset: () => set({ sightings: {} }),
    }),
    { name: 'nudibranch-dex-collection' }
  )
)
