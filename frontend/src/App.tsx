import type { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

const App: FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🐚 NudibranchID.io</h1>
        <p>Identify nudibranch species using AI</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="upload-container">
                <h2>Upload an Image</h2>
                <p>Upload a photo of a nudibranch to identify its species</p>
                <p className="info-text">
                  Using React + TypeScript + Vite with TanStack Query, Zustand, and more!
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Powered by FastAPI + TensorFlow</p>
      </footer>
    </div>
  )
}

export default App
