/**
 * Nudibranch data service.
 *
 * The Dex ships with a curated local dataset so it runs with no backend. The
 * Promise-returning signatures mirror a REST client, so this layer can later be
 * swapped for live API calls (see api.ts) without touching the query hooks or
 * components.
 */

import { SPECIES } from '@/data/species'
import type { NudibranchSpecies, RegionId } from '@/types/nudibranch'

const byDexNumber = (a: NudibranchSpecies, b: NudibranchSpecies): number =>
  a.dexNumber - b.dexNumber

export const nudibranchService = {
  /** All species, ordered by Dex number. */
  getAllSpecies: (): Promise<NudibranchSpecies[]> => {
    return Promise.resolve([...SPECIES].sort(byDexNumber))
  },

  /** A single species by slug id, or null if unknown. */
  getSpeciesById: (id: string): Promise<NudibranchSpecies | null> => {
    return Promise.resolve(SPECIES.find((species) => species.id === id) ?? null)
  },

  /** Species tagged with the given region. */
  getSpeciesByRegion: (regionId: RegionId): Promise<NudibranchSpecies[]> => {
    return Promise.resolve(
      SPECIES.filter((species) => species.regions.includes(regionId)).sort(byDexNumber)
    )
  },
}
