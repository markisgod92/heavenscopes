import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../custom-hooks/useSession'
import { RealTimeDataProvider } from '../contexts/RealTimeDataContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { NavAndFooterProvider } from '../contexts/NavAndFooterContext'

export const ProtectedRoutes = () => {
    const session = useSession()

    if(!session) {
        return <Navigate to={'/'} replace />
    }

    return (
        <RealTimeDataProvider>
            <ThemeProvider>
                <NavAndFooterProvider>
                    <Outlet />
                </NavAndFooterProvider>
            </ThemeProvider>
        </RealTimeDataProvider>
    )
}