/**
 * Utility functions for formatting data
 */

/**
 * Format confidence percentage
 */
export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`
}

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Format time
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/* ---- Dex-specific formatters ---- */

interface Range {
  min: number
  max: number
}

const range = ({ min, max }: Range, unit: string): string =>
  min === max ? `${min} ${unit}` : `${min}–${max} ${unit}`

/** Zero-padded Dex label, e.g. 1 -> "#001". */
export const dexId = (n: number): string => `#${String(n).padStart(3, '0')}`

/** Body length, in mm or cm for larger animals. */
export const formatSize = (minMm: number, maxMm: number): string => {
  if (maxMm >= 100) {
    return range({ min: +(minMm / 10).toFixed(1), max: +(maxMm / 10).toFixed(1) }, 'cm')
  }
  return range({ min: minMm, max: maxMm }, 'mm')
}

/** Depth range in metres. */
export const formatDepth = (minM: number, maxM: number): string =>
  range({ min: minM, max: maxM }, 'm')

/** Water temperature range in Celsius. */
export const formatTemp = (minC: number, maxC: number): string =>
  `${range({ min: minC, max: maxC }, '')}°C`.replace(' °C', '°C')
