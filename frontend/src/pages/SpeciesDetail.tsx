import { useEffect, type FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SPECIES } from '@/data/species'
import { getRegion } from '@/data/regions'
import { useSpeciesById } from '@/hooks/useNudibranchQuery'
import { dexId } from '@/utils/formatters'
import { SpeciesImage } from '@/components/SpeciesImage'
import { RegionBadge } from '@/components/RegionBadge'
import { SpecimenReadout } from '@/components/SpecimenReadout'
import { SeenToggle } from '@/components/SeenToggle'
import { FavouriteButton, BucketListButton } from '@/components/CollectionButtons'

const ordered = [...SPECIES].sort((a, b) => a.dexNumber - b.dexNumber)

export const SpeciesDetail: FC = () => {
  const { id = '' } = useParams()
  const { data: species, isLoading } = useSpeciesById(id)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [id])

  if (isLoading) {
    return <div className="page detail detail--loading" />
  }

  if (!species) {
    return (
      <div className="page empty">
        <p className="empty__glyph" aria-hidden="true">
          🪸
        </p>
        <h2>Species not found</h2>
        <p>That codex entry doesn&apos;t exist yet.</p>
        <Link to="/" className="btn">
          Back to the codex
        </Link>
      </div>
    )
  }

  const index = ordered.findIndex((s) => s.id === species.id)
  const prev = index > 0 ? ordered[index - 1] : ordered[ordered.length - 1]
  const next = index < ordered.length - 1 ? ordered[index + 1] : ordered[0]
  const accent = getRegion(species.regions[0] ?? 'indo-pacific').accent

  return (
    <div className="page detail" style={{ '--accent': accent } as React.CSSProperties}>
      <Link to="/" className="detail__back">
        ← Codex
      </Link>

      <div className="detail__grid">
        <div className="detail__media">
          <div className="detail__frame">
            <SpeciesImage src={species.imageUrl} alt={species.commonName} accent={accent} />
            <span className="detail__dex">{dexId(species.dexNumber)}</span>
          </div>
          <p className="detail__credit">
            Photo: {species.imageCredit} · {species.imageLicense} · Wikimedia Commons
          </p>
        </div>

        <div className="detail__intro">
          <div className="detail__regions">
            {species.regions.map((regionId) => (
              <RegionBadge key={regionId} regionId={regionId} />
            ))}
          </div>
          <h1 className="detail__name">{species.commonName}</h1>
          <p className="detail__sci">
            <em>{species.scientificName}</em> {species.authority}
          </p>

          <div className="taxo">
            <span className="taxo__item">{species.taxonomy.order}</span>
            <span className="taxo__sep">›</span>
            <span className="taxo__item">{species.taxonomy.family}</span>
            <span className="taxo__sep">›</span>
            <span className="taxo__item">{species.taxonomy.genus}</span>
          </div>

          <SpecimenReadout species={species} />
          <SeenToggle species={species} />
          <div className="detail__collect">
            <FavouriteButton speciesId={species.id} variant="labelled" />
            <BucketListButton speciesId={species.id} variant="labelled" />
          </div>
        </div>
      </div>

      <div className="detail__body">
        <section className="detail__section detail__section--lead">
          <h2 className="detail__h2">Overview</h2>
          <p>{species.description}</p>
        </section>

        <section className="detail__section">
          <h2 className="detail__h2">How to identify</h2>
          <ul className="marklist">
            {species.idCharacteristics.map((mark) => (
              <li key={mark}>{mark}</li>
            ))}
          </ul>
        </section>

        <div className="detail__facts">
          <div className="factcard">
            <h3>Habitat</h3>
            <p>{species.habitat}</p>
          </div>
          <div className="factcard">
            <h3>Diet</h3>
            <p>{species.diet}</p>
          </div>
          <div className="factcard">
            <h3>Distribution</h3>
            <p>{species.distribution}</p>
          </div>
        </div>

        <section className="detail__section funfact">
          <h2 className="detail__h2">Did you know?</h2>
          <p>{species.funFact}</p>
        </section>
      </div>

      <nav className="detail__nav" aria-label="Browse species">
        <Link to={`/species/${prev?.id ?? ''}`} className="detail__navlink detail__navlink--prev">
          <span className="detail__navdex">{dexId(prev?.dexNumber ?? 0)}</span>
          <span className="detail__navname">{prev?.commonName}</span>
        </Link>
        <Link to={`/species/${next?.id ?? ''}`} className="detail__navlink detail__navlink--next">
          <span className="detail__navdex">{dexId(next?.dexNumber ?? 0)}</span>
          <span className="detail__navname">{next?.commonName}</span>
        </Link>
      </nav>
    </div>
  )
}
