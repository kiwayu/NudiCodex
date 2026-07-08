import { useMemo, useState, type FC } from 'react'
import type { RegionId } from '@/types/nudibranch'
import { useSpecies } from '@/hooks/useNudibranchQuery'
import { SpeciesCard } from '@/components/SpeciesCard'
import { FilterBar } from '@/components/FilterBar'

export const DexGrid: FC = () => {
  const { data: species = [], isLoading } = useSpecies()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<RegionId | 'all'>('all')
  const [family, setFamily] = useState('all')

  const families = useMemo(
    () => Array.from(new Set(species.map((s) => s.taxonomy.family))).sort(),
    [species]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return species.filter((s) => {
      const matchesQuery =
        !query ||
        s.commonName.toLowerCase().includes(query) ||
        s.scientificName.toLowerCase().includes(query)
      const matchesRegion = region === 'all' || s.regions.includes(region)
      const matchesFamily = family === 'all' || s.taxonomy.family === family
      return matchesQuery && matchesRegion && matchesFamily
    })
  }, [species, search, region, family])

  return (
    <div className="page dexgrid">
      <section className="dexgrid__hero">
        <p className="eyebrow">Field guide · {species.length} species</p>
        <h1 className="dexgrid__title">The NudiCodex</h1>
        <p className="dexgrid__lede">
          The ocean&apos;s most extravagant animals, catalogued. Browse the sea slugs, read each
          field entry, and log every species you&apos;ve seen across the world&apos;s dive regions.
        </p>
      </section>

      <FilterBar
        search={search}
        onSearch={setSearch}
        activeRegion={region}
        onRegion={setRegion}
        activeFamily={family}
        onFamily={setFamily}
        families={families}
        resultCount={filtered.length}
        totalCount={species.length}
      />

      {isLoading ? (
        <div className="species-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="species-card species-card--skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p className="empty__glyph" aria-hidden="true">
            🌊
          </p>
          <h2>No species match</h2>
          <p>Try clearing the search or picking a different region.</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearch('')
              setRegion('all')
              setFamily('all')
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="species-grid">
          {filtered.map((s, i) => (
            <SpeciesCard key={s.id} species={s} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
