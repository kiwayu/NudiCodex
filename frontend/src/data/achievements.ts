/**
 * Achievements — milestone badges computed from the diver's collection.
 *
 * Each achievement is derived purely from the stored sightings plus the species
 * dataset, so it stays correct as the codex grows.
 */

import type { RegionId } from '@/types/nudibranch'
import type { Sighting } from '@/store/collectionStore'
import { SPECIES } from './species'
import { REGIONS } from './regions'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  /** Progress toward the goal, capped at target. */
  current: number
  target: number
  unlocked: boolean
}

interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  current: number
  target: number
}

export const computeAchievements = (sightings: Record<string, Sighting>): Achievement[] => {
  const seenCount = Object.keys(sightings).length
  const total = SPECIES.length
  const seenSpecies = SPECIES.filter((species) => sightings[species.id])

  const regionsWithSighting = new Set<RegionId>()
  for (const sighting of Object.values(sightings)) {
    for (const region of sighting.regions) regionsWithSighting.add(region)
  }

  const completedRegions = REGIONS.filter((region) => {
    const inRegion = SPECIES.filter((s) => s.regions.includes(region.id))
    const seenInRegion = inRegion.filter((s) => sightings[s.id]?.regions.includes(region.id))
    return inRegion.length > 0 && seenInRegion.length === inRegion.length
  }).length

  const families = new Set(seenSpecies.map((s) => s.taxonomy.family)).size
  const orders = new Set(seenSpecies.map((s) => s.taxonomy.order)).size

  const deepSeen = seenSpecies.filter((s) => s.depth.maxM >= 50).length
  const giantSeen = seenSpecies.filter((s) => s.size.maxMm >= 100).length
  const tinySeen = seenSpecies.filter((s) => s.size.minMm <= 15).length
  const coldSeen = seenSpecies.filter((s) => s.waterTemp.minC <= 12).length
  const sacoglossaSeen = seenSpecies.filter((s) => s.taxonomy.order === 'Sacoglossa').length
  const chromodoridSeen = seenSpecies.filter((s) => s.taxonomy.family === 'Chromodorididae').length

  const cap = (value: number, target: number): number => Math.min(value, target)

  const defs: AchievementDef[] = [
    {
      id: 'first-contact',
      name: 'First Contact',
      description: 'Log your first sighting',
      icon: '🔍',
      current: cap(seenCount, 1),
      target: 1,
    },
    {
      id: 'rock-pooler',
      name: 'Rock Pooler',
      description: 'Log 5 species',
      icon: '🐚',
      current: cap(seenCount, 5),
      target: 5,
    },
    {
      id: 'keen-diver',
      name: 'Keen Diver',
      description: 'Log 10 species',
      icon: '🤿',
      current: cap(seenCount, 10),
      target: 10,
    },
    {
      id: 'seasoned-spotter',
      name: 'Seasoned Spotter',
      description: 'Log 25 species',
      icon: '🔦',
      current: cap(seenCount, 25),
      target: 25,
    },
    {
      id: 'reef-veteran',
      name: 'Reef Veteran',
      description: 'Log 50 species',
      icon: '🪸',
      current: cap(seenCount, 50),
      target: 50,
    },
    {
      id: 'codex-complete',
      name: 'Codex Complete',
      description: 'Log every species in the codex',
      icon: '🏆',
      current: cap(seenCount, total),
      target: total,
    },
    {
      id: 'globetrotter',
      name: 'Globetrotter',
      description: 'Log a sighting in every ocean region',
      icon: '🌏',
      current: regionsWithSighting.size,
      target: REGIONS.length,
    },
    {
      id: 'region-master',
      name: 'Region Master',
      description: 'Fully complete any one region',
      icon: '🥇',
      current: cap(completedRegions, 1),
      target: 1,
    },
    {
      id: 'taxonomist',
      name: 'Taxonomist',
      description: 'Log a species from all three orders',
      icon: '🧬',
      current: cap(orders, 3),
      target: 3,
    },
    {
      id: 'family-collector',
      name: 'Family Collector',
      description: 'Log species from 12 different families',
      icon: '👪',
      current: cap(families, 12),
      target: 12,
    },
    {
      id: 'codex-devotee',
      name: 'Codex Devotee',
      description: 'Log 75 species',
      icon: '📖',
      current: cap(seenCount, 75),
      target: 75,
    },
    {
      id: 'naturalist',
      name: 'Naturalist',
      description: 'Log species from 20 different families',
      icon: '🧾',
      current: cap(families, 20),
      target: 20,
    },
    {
      id: 'world-tour',
      name: 'World Tour',
      description: 'Fully complete every ocean region',
      icon: '🗺️',
      current: completedRegions,
      target: REGIONS.length,
    },
    {
      id: 'chromodorid-fan',
      name: 'Chromodorid Fan',
      description: 'Log 10 species of the family Chromodorididae',
      icon: '🎨',
      current: cap(chromodoridSeen, 10),
      target: 10,
    },
    {
      id: 'into-the-deep',
      name: 'Into the Deep',
      description: 'Log a species recorded at 50 m or deeper',
      icon: '🌊',
      current: cap(deepSeen, 1),
      target: 1,
    },
    {
      id: 'gentle-giant',
      name: 'Gentle Giant',
      description: 'Log a species 10 cm or larger',
      icon: '🐋',
      current: cap(giantSeen, 1),
      target: 1,
    },
    {
      id: 'tiny-treasure',
      name: 'Tiny Treasure',
      description: 'Log a species that can be under 15 mm',
      icon: '🔬',
      current: cap(tinySeen, 1),
      target: 1,
    },
    {
      id: 'leaf-grazer',
      name: 'Leaf Grazer',
      description: 'Log a sacoglossan, a solar-powered sea slug',
      icon: '🍃',
      current: cap(sacoglossaSeen, 1),
      target: 1,
    },
    {
      id: 'cold-water-diver',
      name: 'Cold-water Diver',
      description: 'Log a cool temperate-water species',
      icon: '❄️',
      current: cap(coldSeen, 1),
      target: 1,
    },
  ]

  return defs.map((def) => ({ ...def, unlocked: def.current >= def.target }))
}
