import { useMemo, type FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SPECIES } from '@/data/species'
import { REGIONS } from '@/data/regions'
import { computeAchievements } from '@/data/achievements'
import { useCollectionStore } from '@/store/collectionStore'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/auth/authService'
import { ProgressRing } from '@/components/ProgressRing'
import { SpeciesCard } from '@/components/SpeciesCard'

const SPECIES_BY_ID = new Map(SPECIES.map((s) => [s.id, s]))

const ORDER_COLOURS: Record<string, string> = {
  Nudibranchia: '#34d3ee',
  Cephalaspidea: '#a78bfa',
  Sacoglossa: '#34d399',
}

const monthLabel = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

export const Profile: FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const sightings = useCollectionStore((s) => s.sightings)
  const favourites = useCollectionStore((s) => s.favourites)
  const bucketList = useCollectionStore((s) => s.bucketList)

  const total = SPECIES.length
  const seenSpecies = useMemo(() => SPECIES.filter((s) => sightings[s.id]), [sightings])
  const seenCount = seenSpecies.length

  const achievements = useMemo(() => computeAchievements(sightings), [sightings])
  const unlocked = achievements.filter((a) => a.unlocked).length

  const familiesSeen = useMemo(
    () => new Set(seenSpecies.map((s) => s.taxonomy.family)).size,
    [seenSpecies]
  )
  const regionsCompleted = useMemo(
    () =>
      REGIONS.filter((r) => {
        const inRegion = SPECIES.filter((s) => s.regions.includes(r.id))
        const seen = inRegion.filter((s) => sightings[s.id]?.regions.includes(r.id))
        return inRegion.length > 0 && seen.length === inRegion.length
      }).length,
    [sightings]
  )

  // Cumulative sightings over time, bucketed by month.
  const timeline = useMemo(() => {
    const dated = seenSpecies
      .map((s) => sightings[s.id]?.firstSeenAt)
      .filter((d): d is string => Boolean(d))
      .sort()
    const byMonth = new Map<string, number>()
    for (const iso of dated) {
      const key = monthLabel(iso)
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1)
    }
    let running = 0
    return Array.from(byMonth.entries()).map(([month, count]) => {
      running += count
      return { month, total: running }
    })
  }, [seenSpecies, sightings])

  const byOrder = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of seenSpecies) {
      counts.set(s.taxonomy.order, (counts.get(s.taxonomy.order) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
  }, [seenSpecies])

  const byRegion = useMemo(
    () =>
      REGIONS.map((r) => ({
        name: r.name,
        accent: r.accent,
        seen: SPECIES.filter(
          (s) => s.regions.includes(r.id) && sightings[s.id]?.regions.includes(r.id)
        ).length,
      })),
    [sightings]
  )

  const favouriteSpecies = useMemo(
    () =>
      Object.keys(favourites)
        .map((id) => SPECIES_BY_ID.get(id))
        .filter((s): s is (typeof SPECIES)[number] => Boolean(s)),
    [favourites]
  )
  const bucketSpecies = useMemo(
    () =>
      Object.keys(bucketList)
        .map((id) => SPECIES_BY_ID.get(id))
        .filter((s): s is (typeof SPECIES)[number] => Boolean(s)),
    [bucketList]
  )

  const collectingSince = timeline.length > 0 ? timeline[0]?.month : null

  const handleSignOut = async () => {
    await authService.signOut()
    navigate('/', { replace: true })
  }

  const tiles: Array<{ label: string; value: string | number }> = [
    { label: 'Species seen', value: seenCount },
    { label: 'Codex complete', value: `${Math.round((seenCount / total) * 100)}%` },
    { label: 'Favourites', value: favouriteSpecies.length },
    { label: 'Bucket-list', value: bucketSpecies.length },
    { label: 'Regions done', value: `${regionsCompleted}/${REGIONS.length}` },
    { label: 'Families', value: familiesSeen },
    { label: 'Achievements', value: `${unlocked}/${achievements.length}` },
  ]

  return (
    <div className="page profile-page">
      <section className="profile-hero">
        <ProgressRing value={seenCount} total={total} label="Codex logged" />
        <div className="profile-hero__text">
          <p className="eyebrow">Your profile</p>
          <h1 className="profile-hero__name">{user?.displayName ?? 'Diver'}</h1>
          <p className="profile-hero__meta">
            {user?.email}
            {collectingSince ? ` · collecting since ${collectingSince}` : ''}
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => void handleSignOut()}>
            Sign out
          </button>
        </div>
      </section>

      <section className="metric-grid">
        {tiles.map((t) => (
          <div key={t.label} className="metric">
            <span className="metric__value">{t.value}</span>
            <span className="metric__label">{t.label}</span>
          </div>
        ))}
      </section>

      <div className="profile-charts">
        <section className="chartcard">
          <h2 className="profile__h2">Sightings over time</h2>
          {timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timeline} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="fillSeen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d3ee" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#34d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#8ea6b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8ea6b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f1e2e',
                    border: '1px solid rgba(122,165,196,0.28)',
                    borderRadius: 10,
                    color: '#eaf3f8',
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#34d3ee"
                  strokeWidth={2}
                  fill="url(#fillSeen)"
                  name="Species logged"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="chartcard__empty">Log a species to start your timeline.</p>
          )}
        </section>

        <section className="chartcard">
          <h2 className="profile__h2">By order</h2>
          {byOrder.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byOrder}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {byOrder.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={ORDER_COLOURS[entry.name] ?? '#60a5fa'}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f1e2e',
                    border: '1px solid rgba(122,165,196,0.28)',
                    borderRadius: 10,
                    color: '#eaf3f8',
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="chartcard__empty">No sightings yet.</p>
          )}
          <div className="chart-legend">
            {byOrder.map((o) => (
              <span key={o.name} className="chart-legend__item">
                <span
                  className="chart-legend__dot"
                  style={{ background: ORDER_COLOURS[o.name] ?? '#60a5fa' }}
                />
                {o.name} ({o.value})
              </span>
            ))}
          </div>
        </section>

        <section className="chartcard chartcard--wide">
          <h2 className="profile__h2">By region</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={byRegion}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: '#8ea6b8', fontSize: 11 }}
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
              />
              <Bar
                dataKey="seen"
                radius={[0, 6, 6, 0]}
                background={{ fill: 'rgba(122,165,196,0.1)' }}
              >
                {byRegion.map((r) => (
                  <Cell key={r.name} fill={r.accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <ProfileGallery
        title="Favourites"
        empty="Tap the ♥ on a species to add it here."
        species={favouriteSpecies}
      />
      <ProfileGallery
        title="Bucket-list"
        empty="Tap the ☆ on a species you want to see."
        species={bucketSpecies}
      />

      <p className="progress__foot">
        <Link to="/progress" className="link">
          View regions &amp; achievements →
        </Link>
      </p>
    </div>
  )
}

const ProfileGallery: FC<{ title: string; empty: string; species: (typeof SPECIES)[number][] }> = ({
  title,
  empty,
  species,
}) => (
  <section className="profile-gallery">
    <h2 className="profile__h2">
      {title} <span className="profile__count">{species.length}</span>
    </h2>
    {species.length > 0 ? (
      <div className="species-grid">
        {species.map((s, i) => (
          <SpeciesCard key={s.id} species={s} index={i} />
        ))}
      </div>
    ) : (
      <p className="chartcard__empty">{empty}</p>
    )}
  </section>
)
