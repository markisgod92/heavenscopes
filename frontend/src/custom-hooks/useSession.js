import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { isTokenExpired } from "../utils/isTokenExpired"


const getAuth = () => {
    return JSON.parse(localStorage.getItem('Authorization'))
}


export const useSession = () => {
    const session = getAuth()
    const decodedsession = session ? jwtDecode(session) : null
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('Auth')
        navigate('/')
    }

    useEffect(() => {
        if (isTokenExpired(decodedsession?.exp)) {
            logout()
        }
    }, [navigate, session])

    return decodedsession
}