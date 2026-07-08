import type { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DexGrid } from '@/pages/DexGrid'
import { SpeciesDetail } from '@/pages/SpeciesDetail'
import { Progress } from '@/pages/Progress'
import { NotFound } from '@/pages/NotFound'
import './App.css'

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DexGrid />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
