import { createContext, useState } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isNightModeOn, setNightModeOn] = useState(true)

    const toggleNightMode = () => {
        setNightModeOn(prev => !prev)
    }

    return (
        <ThemeContext.Provider
            value={{ isNightModeOn, toggleNightMode }}
        >
            { children }
        </ThemeContext.Provider>
    )
}