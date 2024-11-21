import { createContext, useState } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isNightModeOn, setNightModeOn] = useState(false)

    return (
        <ThemeContext.Provider
            value={{ isNightModeOn, setNightModeOn }}
        >
            { children }
        </ThemeContext.Provider>
    )
}