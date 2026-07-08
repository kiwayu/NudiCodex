import type { FC } from 'react'
import type { RegionId } from '@/types/nudibranch'
import { getRegion } from '@/data/regions'

interface RegionBadgeProps {
  regionId: RegionId
  /** "dot" for a compact colour dot, "pill" for a labelled chip. */
  variant?: 'dot' | 'pill'
}

export const RegionBadge: FC<RegionBadgeProps> = ({ regionId, variant = 'pill' }) => {
  const region = getRegion(regionId)

  if (variant === 'dot') {
    return (
      <span
        className="region-dot"
        style={{ background: region.accent }}
        title={region.name}
        aria-label={region.name}
      />
    )
  }

  return (
    <span
      className="region-pill"
      style={{
        color: region.accent,
        borderColor: `${region.accent}55`,
        background: `${region.accent}14`,
      }}
    >
      {region.name}
    </span>
  )
}
