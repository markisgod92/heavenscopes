import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css'
import { CelestialBodyPage } from './pages/CelestialBodyPage';
import { RealTimeDataProvider } from './contexts/RealTimeDataContext';
import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoutes } from './middlewares/ProtectedRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavAndFooterProvider } from './contexts/NavAndFooterContext';
import { CreateAccount } from './pages/CreateAccount';
import { AccountCreated } from './pages/AccountCreated';
import { Feed } from './pages/Feed';
import { UserPage } from './pages/UserPage';
import { VisibleNow } from './pages/VisibleNow';
import { Media } from './pages/Media';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<CreateAccount />} />
        <Route element={
          <RealTimeDataProvider>
            <ThemeProvider>
              <NavAndFooterProvider>
                <ProtectedRoutes></ProtectedRoutes>
              </NavAndFooterProvider>
            </ThemeProvider>
          </RealTimeDataProvider>
        }>
          <Route exact path='/feed' element={<Feed />} />
          <Route path='/media/:paramId?' element={<Media />} />
          <Route path='/visiblenow' element={<VisibleNow />} />
          <Route path='/feed/:bodyName' element={<CelestialBodyPage />} />
          <Route path='/new-user-redirect' element={<AccountCreated />} />
          <Route path='/profile/:userId' element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
