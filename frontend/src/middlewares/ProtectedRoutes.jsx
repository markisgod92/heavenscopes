import { Outlet } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'

const checkToken = () => {
    return JSON.parse(localStorage.getItem('Authorization'))
}

export const ProtectedRoutes = () => {
    const isAuthorized = checkToken()
    return isAuthorized ? <Outlet /> : <LoginPage />
}