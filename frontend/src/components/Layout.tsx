import type { FC } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { SPECIES } from '@/data/species'
import { useCollectionStore } from '@/store/collectionStore'
import { useAuthStore } from '@/store/authStore'

export const Layout: FC = () => {
  const seenCount = useCollectionStore((state) => Object.keys(state.sightings).length)
  const user = useAuthStore((state) => state.user)
  const total = SPECIES.length

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="brand" aria-label="NudiCodex home">
            <span className="brand__glyph" aria-hidden="true">
              🐚
            </span>
            <span className="brand__text">
              Nudi<span className="brand__accent">Codex</span>
            </span>
          </NavLink>

          <nav className="topnav">
            <NavLink to="/" end className="topnav__link">
              Codex
            </NavLink>
            <NavLink to="/progress" className="topnav__link">
              Regions
            </NavLink>
            {user ? (
              <NavLink to="/profile" className="topnav__link topnav__link--profile">
                <span className="topnav__avatar" aria-hidden="true">
                  {(user.displayName[0] ?? 'D').toUpperCase()}
                </span>
                Profile
              </NavLink>
            ) : (
              <NavLink to="/login" className="topnav__link">
                Log in
              </NavLink>
            )}
            <div className="topnav__count" title="Species logged">
              <span className="topnav__count-num">{seenCount}</span>
              <span className="topnav__count-total">/ {total}</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          A field-guide codex of {total} nudibranchs &amp; sea slugs. Photos from Wikimedia Commons
          under Creative Commons licences.
        </p>
      </footer>
    </div>
  )
}
