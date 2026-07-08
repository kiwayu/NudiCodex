import type { FC } from 'react'

interface ProgressRingProps {
  value: number
  total: number
  size?: number
  label?: string
}

/**
 * Overall completion ring — the "Dex complete" gauge.
 */
export const ProgressRing: FC<ProgressRingProps> = ({ value, total, size = 168, label }) => {
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = total === 0 ? 0 : value / total
  const offset = circumference * (1 - pct)

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--glow)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="ring__progress"
        />
      </svg>
      <div className="ring__center">
        <span className="ring__pct">{Math.round(pct * 100)}%</span>
        <span className="ring__label">{label ?? `${value} / ${total}`}</span>
      </div>
    </div>
  )
}
