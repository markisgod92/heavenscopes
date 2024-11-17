import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { CelestialBodyPage } from './pages/CelestialBodyPage';
import { RealTimeDataProvider } from './contexts/RealTimeDataContext';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <>
      {/* <RealTimeDataProvider>
        <CelestialBodyPage />
      </RealTimeDataProvider> */}
      <LoginPage />
    </>
  )
}

export default App
