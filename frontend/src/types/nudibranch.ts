/**
 * Type definitions for the NudiCodex
 */

export type RegionId =
  'indo-pacific' | 'coral-triangle' | 'red-sea' | 'mediterranean' | 'eastern-pacific' | 'atlantic'

export interface Region {
  id: RegionId
  name: string
  ocean: string
  blurb: string
  /** Accent colour (hex) used for this region across the UI */
  accent: string
}

export interface SizeRange {
  minMm: number
  maxMm: number
}

export interface DepthRange {
  minM: number
  maxM: number
}

export interface WaterTemp {
  minC: number
  maxC: number
}

export interface Taxonomy {
  order: string
  family: string
  genus: string
}

export interface NudibranchSpecies {
  /** URL-safe slug, e.g. "chromodoris-annae" */
  id: string
  /** Dex catalogue number, 1-indexed */
  dexNumber: number
  commonName: string
  scientificName: string
  authority: string
  taxonomy: Taxonomy
  description: string
  /** Field marks used to tell this species apart */
  idCharacteristics: string[]
  habitat: string
  diet: string
  distribution: string
  regions: RegionId[]
  size: SizeRange
  depth: DepthRange
  waterTemp: WaterTemp
  funFact: string
  /** Source image (Wikimedia Commons) */
  imageUrl: string
  imageCredit: string
  imageLicense: string
}

/* ---- Identification types (kept for the API service layer) ---- */

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
