import { createContext, useContext } from "react"
import { ThemeContext } from "./ThemeContext"

const NavAndFooterContext = createContext()

export const NavAndFooterProvider = ({ children }) => {
    const { isNightModeOn } = useContext(ThemeContext)

    return (
        <NavAndFooterContext.Provider
            value={''}
        >
            <div className={
                `vh-100 d-flex flex-column justify-content-between ${isNightModeOn ? 'bg-black text-danger' : 'bg-dark text-white'}`
            }>
                {children}
            </div>
        </NavAndFooterContext.Provider>
    )
}