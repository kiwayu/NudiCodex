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

const MAX_ATTEMPTS = 4

/**
 * Species photo that degrades gracefully under load.
 *
 * The first attempt requests a resized thumbnail (via Commons' Special:FilePath),
 * which is light but can be rate-limited when many images load at once. On error
 * it retries the original upload.wikimedia.org URL (served from Wikimedia's CDN),
 * with a growing backoff and jitter so the retry lands after a throttling burst
 * subsides. Each attempt remounts the <img> (via key) to force a fresh request.
 * Only after several failed attempts does it show a gradient placeholder.
 */
export const SpeciesImage: FC<SpeciesImageProps> = ({ src, alt, width, accent, className }) => {
  const thumbUrl = width ? imageThumb(src, width) : src
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)

  // Attempt 0 uses the light thumbnail; retries fall back to the CDN original.
  const currentSrc = attempt === 0 ? thumbUrl : src

  const handleError = () => {
    if (attempt + 1 >= MAX_ATTEMPTS) {
      setFailed(true)
      return
    }
    const delay = 500 + attempt * 700 + Math.random() * 600
    window.setTimeout(() => setAttempt((a) => a + 1), delay)
  }

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
      key={attempt}
      className={`species-image ${className ?? ''}`}
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={handleError}
    />
  )
}
