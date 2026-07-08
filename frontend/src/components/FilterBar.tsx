import type { FC } from 'react'
import type { RegionId } from '@/types/nudibranch'
import { REGIONS } from '@/data/regions'

interface FilterBarProps {
  search: string
  onSearch: (value: string) => void
  activeRegion: RegionId | 'all'
  onRegion: (value: RegionId | 'all') => void
  activeFamily: string
  onFamily: (value: string) => void
  families: string[]
  resultCount: number
  totalCount: number
}

export const FilterBar: FC<FilterBarProps> = ({
  search,
  onSearch,
  activeRegion,
  onRegion,
  activeFamily,
  onFamily,
  families,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="filterbar">
      <div className="filterbar__row">
        <div className="filterbar__search">
          <span className="filterbar__search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by name or scientific name…"
            aria-label="Search species"
          />
        </div>

        <label className="filterbar__select">
          <span>Family</span>
          <select value={activeFamily} onChange={(event) => onFamily(event.target.value)}>
            <option value="all">All families</option>
            {families.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
        </label>

        <p className="filterbar__count">
          <strong>{resultCount}</strong> / {totalCount}
        </p>
      </div>

      <div className="filterbar__regions" role="group" aria-label="Filter by region">
        <button
          type="button"
          className={`region-chip ${activeRegion === 'all' ? 'is-active' : ''}`}
          onClick={() => onRegion('all')}
        >
          All regions
        </button>
        {REGIONS.map((region) => (
          <button
            key={region.id}
            type="button"
            className={`region-chip ${activeRegion === region.id ? 'is-active' : ''}`}
            style={
              {
                '--chip-accent': region.accent,
              } as React.CSSProperties
            }
            onClick={() => onRegion(region.id)}
          >
            <span className="region-chip__dot" style={{ background: region.accent }} />
            {region.name}
          </button>
        ))}
      </div>
    </div>
  )
}
