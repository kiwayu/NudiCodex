import type { FC } from 'react'
import type { NudibranchSpecies } from '@/types/nudibranch'
import { formatSize, formatDepth, formatTemp } from '@/utils/formatters'

interface SpecimenReadoutProps {
  species: NudibranchSpecies
}

/**
 * The signature element: a monospace "specimen label" of dive metrics, styled
 * like a dive-computer readout.
 */
export const SpecimenReadout: FC<SpecimenReadoutProps> = ({ species }) => {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Length', value: formatSize(species.size.minMm, species.size.maxMm) },
    { label: 'Depth', value: formatDepth(species.depth.minM, species.depth.maxM) },
    { label: 'Water', value: formatTemp(species.waterTemp.minC, species.waterTemp.maxC) },
    { label: 'Order', value: species.taxonomy.order },
  ]

  return (
    <dl className="readout" aria-label="Specimen data">
      {rows.map((row) => (
        <div key={row.label} className="readout__row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
