import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { isTokenExpired } from "../utils/isTokenExpired"


const getAuth = () => {
    const token = localStorage.getItem('Authorization')
    return token ? JSON.parse(token) : null
}


export const useSession = () => {
    const session = getAuth()
    const decodedsession = session ? jwtDecode(session) : null
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('Auth')
        navigate('/', {replace: true})
    }

    useEffect(() => {
        if (!session || isTokenExpired(decodedsession?.exp)) {
            logout()
        }
    }, [decodedsession?.exp, session, navigate])

    return decodedsession
}