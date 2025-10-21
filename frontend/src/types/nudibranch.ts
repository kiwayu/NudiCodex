/**
 * Type definitions for nudibranch-related data
 */

export interface NudibranchSpecies {
  id: string
  name: string
  scientificName: string
  description: string
  habitat: string
  distribution: string[]
  imageUrl: string
  thumbnailUrl: string
  characteristics: string[]
  createdAt: string
  updatedAt: string
}

export interface IdentificationResult {
  id: string
  imageUrl: string
  predictions: Prediction[]
  topPrediction: Prediction
  processingTime: number
  createdAt: string
}

export interface Prediction {
  speciesId: string
  speciesName: string
  scientificName: string
  confidence: number
  characteristics: string[]
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

