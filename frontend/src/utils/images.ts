/**
 * Helpers for working with Wikimedia Commons image URLs.
 *
 * Commons resizes any file on demand through its Special:FilePath endpoint, so
 * grid cards can request a smaller render instead of downloading full-resolution
 * originals. (The raw /thumb/ path only serves a fixed set of widths and 400s on
 * the rest, so we route through Special:FilePath, which resizes reliably.)
 */

/** Extract the Commons filename from an upload.wikimedia.org URL. */
const commonsFilename = (url: string): string | undefined => {
  if (url.includes('/thumb/')) {
    // .../commons/thumb/a/bb/<filename>/<width>px-<name>
    return url.match(/\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//)?.[1]
  }
  // .../commons/a/bb/<filename>
  return url.match(/\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)$/)?.[1]
}

/**
 * Return a width-constrained thumbnail URL for a Commons image.
 * Falls back to the original URL if the pattern is not recognised.
 */
export const imageThumb = (url: string, width = 640): string => {
  if (!url.includes('upload.wikimedia.org')) return url
  const filename = commonsFilename(url)
  if (!filename) return url
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`
}
