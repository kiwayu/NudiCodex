import type { FC } from 'react'
import { Link } from 'react-router-dom'
import type { NudibranchSpecies } from '@/types/nudibranch'
import { getRegion } from '@/data/regions'
import { useCollectionStore } from '@/store/collectionStore'
import { dexId } from '@/utils/formatters'
import { SpeciesImage } from './SpeciesImage'
import { RegionBadge } from './RegionBadge'
import { FavouriteButton, BucketListButton } from './CollectionButtons'

interface SpeciesCardProps {
  species: NudibranchSpecies
  /** Reveal animation index for the staggered grid entrance. */
  index?: number
}

export const SpeciesCard: FC<SpeciesCardProps> = ({ species, index = 0 }) => {
  const seen = useCollectionStore((state) => Boolean(state.sightings[species.id]))
  const markSeen = useCollectionStore((state) => state.markSeen)
  const removeSeen = useCollectionStore((state) => state.removeSeen)
  const primaryRegion = species.regions[0] ?? 'indo-pacific'
  const accent = getRegion(primaryRegion).accent

  const handleTick = () => {
    if (seen) {
      removeSeen(species.id)
    } else {
      // Log the sighting against the species' main region so region progress
      // fills in; the diver can refine or add regions on the detail page.
      markSeen(species.id, primaryRegion)
    }
  }

  return (
    <Link
      to={`/species/${species.id}`}
      className={`species-card ${seen ? 'is-seen' : ''}`}
      style={
        {
          '--card-accent': accent,
          '--reveal-delay': `${Math.min(index, 20) * 35}ms`,
        } as React.CSSProperties
      }
    >
      <div className="species-card__frame">
        <SpeciesImage src={species.imageUrl} alt={species.commonName} width={520} accent={accent} />
        <span className="species-card__dex">{dexId(species.dexNumber)}</span>
        <button
          type="button"
          className={`species-card__tick ${seen ? 'is-seen' : ''}`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleTick()
          }}
          aria-pressed={seen}
          title={seen ? 'Logged — click to remove' : 'Mark as seen'}
          aria-label={
            seen
              ? `Remove ${species.commonName} from your codex`
              : `Mark ${species.commonName} as seen`
          }
        >
          {seen ? '✓' : '+'}
        </button>
        <div className="species-card__collect">
          <FavouriteButton speciesId={species.id} />
          <BucketListButton speciesId={species.id} />
        </div>
      </div>

      <div className="species-card__body">
        <h3 className="species-card__name">{species.commonName}</h3>
        <p className="species-card__sci">{species.scientificName}</p>
        <div className="species-card__regions">
          {species.regions.map((regionId) => (
            <RegionBadge key={regionId} regionId={regionId} variant="dot" />
          ))}
        </div>
      </div>
    </Link>
  )
}
