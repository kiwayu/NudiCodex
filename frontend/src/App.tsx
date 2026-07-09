import type { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { RequireAuth } from '@/components/RequireAuth'
import { DexGrid } from '@/pages/DexGrid'
import { SpeciesDetail } from '@/pages/SpeciesDetail'
import { Progress } from '@/pages/Progress'
import { Auth } from '@/pages/Auth'
import { Profile } from '@/pages/Profile'
import { NotFound } from '@/pages/NotFound'
import { useAuthInit } from '@/auth/useAuthInit'
import './App.css'

const App: FC = () => {
  useAuthInit()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DexGrid />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
