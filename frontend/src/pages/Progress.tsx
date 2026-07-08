import { useMemo, type FC } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SPECIES } from '@/data/species'
import { REGIONS } from '@/data/regions'
import { useCollectionStore } from '@/store/collectionStore'
import { ProgressRing } from '@/components/ProgressRing'

interface RegionStat {
  id: string
  name: string
  accent: string
  total: number
  seen: number
}

export const Progress: FC = () => {
  const sightings = useCollectionStore((state) => state.sightings)
  const reset = useCollectionStore((state) => state.reset)

  const seenCount = Object.keys(sightings).length
  const total = SPECIES.length

  const regionStats = useMemo<RegionStat[]>(() => {
    return REGIONS.map((region) => {
      const inRegion = SPECIES.filter((s) => s.regions.includes(region.id))
      const seen = inRegion.filter((s) => sightings[s.id]?.regions.includes(region.id)).length
      return {
        id: region.id,
        name: region.name,
        accent: region.accent,
        total: inRegion.length,
        seen,
      }
    })
  }, [sightings])

  return (
    <div className="page progress">
      <section className="progress__hero">
        <ProgressRing value={seenCount} total={total} label="Dex logged" />
        <div className="progress__hero-text">
          <p className="eyebrow">Your collection</p>
          <h1 className="progress__title">Region tracker</h1>
          <p className="progress__lede">
            You&apos;ve logged <strong>{seenCount}</strong> of {total} species. Mark where you
            spotted each one on its Dex page to fill in every ocean region below.
          </p>
          {seenCount > 0 && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                if (window.confirm('Clear your entire Dex collection? This cannot be undone.')) {
                  reset()
                }
              }}
            >
              Reset collection
            </button>
          )}
        </div>
      </section>

      <section className="progress__chart-wrap">
        <h2 className="progress__h2">Species logged by region</h2>
        <div className="progress__chart">
          <ResponsiveContainer width="100%" height={REGIONS.length * 46 + 20}>
            <BarChart
              data={regionStats}
              layout="vertical"
              margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
              barCategoryGap={12}
            >
              <XAxis type="number" domain={[0, 'dataMax']} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={104}
                tick={{ fill: '#8ea6b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  background: '#0f1e2e',
                  border: '1px solid rgba(122,165,196,0.28)',
                  borderRadius: 10,
                  color: '#eaf3f8',
                  fontSize: 13,
                }}
                formatter={(value: number, _name, item) => {
                  const stat = item.payload as RegionStat
                  return [`${value} / ${stat.total} seen`, stat.name]
                }}
              />
              <Bar
                dataKey="seen"
                radius={[0, 6, 6, 0]}
                background={{ fill: 'rgba(122,165,196,0.1)' }}
              >
                {regionStats.map((stat) => (
                  <Cell key={stat.id} fill={stat.accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="progress__regions">
        {regionStats.map((stat) => {
          const pct = stat.total === 0 ? 0 : Math.round((stat.seen / stat.total) * 100)
          return (
            <div
              key={stat.id}
              className="regioncard"
              style={{ '--accent': stat.accent } as React.CSSProperties}
            >
              <div className="regioncard__head">
                <span className="regioncard__dot" style={{ background: stat.accent }} />
                <h3>{stat.name}</h3>
                <span className="regioncard__count">
                  {stat.seen}
                  <span>/{stat.total}</span>
                </span>
              </div>
              <div className="regioncard__bar">
                <span style={{ width: `${pct}%`, background: stat.accent }} />
              </div>
              <p className="regioncard__pct">{pct}% logged</p>
            </div>
          )
        })}
      </section>

      <p className="progress__foot">
        <Link to="/" className="link">
          ← Back to the Dex
        </Link>
      </p>
    </div>
  )
}
