import type { FC } from 'react'
import { Link } from 'react-router-dom'

export const NotFound: FC = () => {
  return (
    <div className="page empty">
      <p className="empty__glyph" aria-hidden="true">
        🌊
      </p>
      <h2>Off the reef</h2>
      <p>That page drifted away with the current.</p>
      <Link to="/" className="btn">
        Back to the codex
      </Link>
    </div>
  )
}
