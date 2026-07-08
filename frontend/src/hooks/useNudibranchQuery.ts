/**
 * React Query hooks for nudibranch data.
 */

import { useQuery } from '@tanstack/react-query'
import { nudibranchService } from '@/services/nudibranch.service'
import type { RegionId } from '@/types/nudibranch'

const DAY = 24 * 60 * 60 * 1000

/** Fetch all species (ordered by Dex number). */
export const useSpecies = () => {
  return useQuery({
    queryKey: ['species'],
    queryFn: () => nudibranchService.getAllSpecies(),
    staleTime: DAY,
  })
}

/** Fetch a single species by slug id. */
export const useSpeciesById = (id: string) => {
  return useQuery({
    queryKey: ['species', id],
    queryFn: () => nudibranchService.getSpeciesById(id),
    enabled: !!id,
    staleTime: DAY,
  })
}

/** Fetch species tagged with a region. */
export const useSpeciesByRegion = (regionId: RegionId) => {
  return useQuery({
    queryKey: ['species', 'region', regionId],
    queryFn: () => nudibranchService.getSpeciesByRegion(regionId),
    staleTime: DAY,
  })
}
