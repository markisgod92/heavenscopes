import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { CelestialBodyPage } from './pages/CelestialBodyPage';
import { RealTimeDataProvider } from './contexts/RealTimeDataContext';
import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoutes, ProtectedRoutesWrapper } from './middlewares/ProtectedRoutes';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route element={
            <RealTimeDataProvider>
              <ProtectedRoutes>
              </ProtectedRoutes>
            </RealTimeDataProvider>
          }>
            <Route exact path='/home' element={<CelestialBodyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
