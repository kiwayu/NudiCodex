import { useState, type FC } from 'react'
import { imageThumb } from '@/utils/images'

interface SpeciesImageProps {
  src: string
  alt: string
  /** Requested thumbnail width; omit for full resolution. */
  width?: number
  /** Accent colour used for the fallback tile. */
  accent: string
  className?: string
}

/**
 * Species photo with a graceful gradient fallback if the remote image fails.
 */
export const SpeciesImage: FC<SpeciesImageProps> = ({ src, alt, width, accent, className }) => {
  const [failed, setFailed] = useState(false)
  const url = width ? imageThumb(src, width) : src

  if (failed) {
    return (
      <div
        className={`species-image species-image--fallback ${className ?? ''}`}
        style={{ background: `radial-gradient(circle at 50% 35%, ${accent}55, #0a1420 75%)` }}
        role="img"
        aria-label={`${alt} (image unavailable)`}
      >
        <span aria-hidden="true">🐚</span>
      </div>
    )
  }

  return (
    <img
      className={`species-image ${className ?? ''}`}
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
