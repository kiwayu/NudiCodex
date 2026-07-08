import type { FC } from 'react'
import type { NudibranchSpecies, RegionId } from '@/types/nudibranch'
import { getRegion } from '@/data/regions'
import { useCollectionStore } from '@/store/collectionStore'

interface SeenToggleProps {
  species: NudibranchSpecies
}

/**
 * Log/unlog a species, plus per-region sighting chips so a diver can record
 * where they saw it. Drives the region completion tracker.
 */
export const SeenToggle: FC<SeenToggleProps> = ({ species }) => {
  const sighting = useCollectionStore((state) => state.sightings[species.id])
  const toggleSeen = useCollectionStore((state) => state.toggleSeen)
  const addRegion = useCollectionStore((state) => state.addRegion)
  const markSeen = useCollectionStore((state) => state.markSeen)

  const seen = Boolean(sighting)

  const handleRegion = (regionId: RegionId) => {
    if (!seen) {
      markSeen(species.id, regionId)
      return
    }
    addRegion(species.id, regionId)
  }

  return (
    <div className="seen">
      <button
        type="button"
        className={`seen__toggle ${seen ? 'is-seen' : ''}`}
        onClick={() => toggleSeen(species.id)}
        aria-pressed={seen}
      >
        <span className="seen__check" aria-hidden="true">
          {seen ? '✓' : '+'}
        </span>
        {seen ? 'Logged in your Dex' : 'Mark as seen'}
      </button>

      <div className="seen__regions">
        <span className="seen__label">Seen in</span>
        {species.regions.map((regionId) => {
          const region = getRegion(regionId)
          const active = sighting?.regions.includes(regionId) ?? false
          return (
            <button
              key={regionId}
              type="button"
              className={`seen__region ${active ? 'is-active' : ''}`}
              style={
                {
                  '--chip-accent': region.accent,
                } as React.CSSProperties
              }
              onClick={() => handleRegion(regionId)}
              aria-pressed={active}
            >
              {region.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
