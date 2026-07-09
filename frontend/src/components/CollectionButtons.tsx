import type { FC, MouseEvent } from 'react'
import { useCollectionStore } from '@/store/collectionStore'

interface ToggleButtonProps {
  speciesId: string
  variant?: 'icon' | 'labelled'
}

const stop = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
}

export const FavouriteButton: FC<ToggleButtonProps> = ({ speciesId, variant = 'icon' }) => {
  const on = useCollectionStore((s) => Boolean(s.favourites[speciesId]))
  const toggle = useCollectionStore((s) => s.toggleFavourite)
  return (
    <button
      type="button"
      className={`collbtn collbtn--fav collbtn--${variant} ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      title={on ? 'Remove from favourites' : 'Add to favourites'}
      aria-label={on ? 'Remove from favourites' : 'Add to favourites'}
      onClick={(e) => {
        stop(e)
        toggle(speciesId)
      }}
    >
      <span className="collbtn__glyph" aria-hidden="true">
        {on ? '♥' : '♡'}
      </span>
      {variant === 'labelled' && <span>{on ? 'Favourited' : 'Favourite'}</span>}
    </button>
  )
}

export const BucketListButton: FC<ToggleButtonProps> = ({ speciesId, variant = 'icon' }) => {
  const on = useCollectionStore((s) => Boolean(s.bucketList[speciesId]))
  const toggle = useCollectionStore((s) => s.toggleBucket)
  return (
    <button
      type="button"
      className={`collbtn collbtn--bucket collbtn--${variant} ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      title={on ? 'Remove from bucket-list' : 'Add to bucket-list'}
      aria-label={on ? 'Remove from bucket-list' : 'Add to bucket-list'}
      onClick={(e) => {
        stop(e)
        toggle(speciesId)
      }}
    >
      <span className="collbtn__glyph" aria-hidden="true">
        {on ? '★' : '☆'}
      </span>
      {variant === 'labelled' && <span>{on ? 'On bucket-list' : 'Bucket-list'}</span>}
    </button>
  )
}
