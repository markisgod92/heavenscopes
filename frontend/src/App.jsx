import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { CelestialBodyPage } from './pages/CelestialBodyPage';
import { RealTimeDataProvider } from './contexts/RealTimeDataContext';

function App() {
  return (
    <>
      <RealTimeDataProvider>
        <CelestialBodyPage />
      </RealTimeDataProvider>
    </>
  )
}

export default App
