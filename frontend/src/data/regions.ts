/**
 * Ocean regions used to group and track sightings.
 * Each region carries an accent colour that themes cards, badges and progress.
 */

import type { Region, RegionId } from '@/types/nudibranch'

export const REGIONS: Region[] = [
  {
    id: 'indo-pacific',
    name: 'Indo-Pacific',
    ocean: 'Indian & Pacific Oceans',
    blurb:
      'The warm tropical belt from East Africa to Hawaii — the richest sea slug fauna on Earth.',
    accent: '#38bdf8',
  },
  {
    id: 'coral-triangle',
    name: 'Coral Triangle',
    ocean: 'Western Pacific',
    blurb:
      'Indonesia, the Philippines and neighbours — the global epicentre of marine biodiversity.',
    accent: '#fb7185',
  },
  {
    id: 'red-sea',
    name: 'Red Sea',
    ocean: 'Red Sea',
    blurb: 'A warm, saline sea walled by desert, home to many endemic reef-dwelling species.',
    accent: '#fb923c',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    ocean: 'Mediterranean Sea',
    blurb: 'Temperate rocky reefs and seagrass meadows between three continents.',
    accent: '#a78bfa',
  },
  {
    id: 'eastern-pacific',
    name: 'Eastern Pacific',
    ocean: 'NE Pacific',
    blurb: 'Cool, kelp-rich coasts from Alaska to Baja, famed for bold temperate nudibranchs.',
    accent: '#34d399',
  },
  {
    id: 'atlantic',
    name: 'Atlantic',
    ocean: 'Atlantic Ocean',
    blurb: 'From Caribbean mangroves to North Atlantic reefs across a wide range of temperatures.',
    accent: '#60a5fa',
  },
]

const REGION_MAP: Record<RegionId, Region> = REGIONS.reduce(
  (acc, region) => {
    acc[region.id] = region
    return acc
  },
  {} as Record<RegionId, Region>
)

export const getRegion = (id: RegionId): Region => REGION_MAP[id]
