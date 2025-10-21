/**
 * React Query hooks for nudibranch data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nudibranchService } from '@/services/nudibranch.service'

/**
 * Hook to fetch all species
 */
export const useSpecies = () => {
  return useQuery({
    queryKey: ['species'],
    queryFn: () => nudibranchService.getAllSpecies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch species by ID
 */
export const useSpeciesById = (id: string) => {
  return useQuery({
    queryKey: ['species', id],
    queryFn: () => nudibranchService.getSpeciesById(id),
    enabled: !!id,
  })
}

/**
 * Hook to identify image
 */
export const useIdentifyImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (imageFile: File) => nudibranchService.identifyImage(imageFile),
    onSuccess: () => {
      // Invalidate history query to refetch
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })
}

/**
 * Hook to fetch identification history
 */
export const useHistory = () => {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => nudibranchService.getHistory(),
  })
}

