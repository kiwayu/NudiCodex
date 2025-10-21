/**
 * Nudibranch API service
 */

import { apiClient } from './api'
import type { NudibranchSpecies, IdentificationResult } from '@/types/nudibranch'

export const nudibranchService = {
  /**
   * Get all species
   */
  getAllSpecies: async () => {
    const response = await apiClient.get<NudibranchSpecies[]>('/api/v1/species')
    return response.data
  },

  /**
   * Get species by ID
   */
  getSpeciesById: async (id: string) => {
    const response = await apiClient.get<NudibranchSpecies>(`/api/v1/species/${id}`)
    return response.data
  },

  /**
   * Identify nudibranch from image
   */
  identifyImage: async (imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await apiClient.post<IdentificationResult>('/api/v1/identify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * Get identification history
   */
  getHistory: async () => {
    const response = await apiClient.get<IdentificationResult[]>('/api/v1/history')
    return response.data
  },
}

