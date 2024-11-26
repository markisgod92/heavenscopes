import { createContext, useEffect, useState } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isNightModeOn, setNightModeOn] = useState(false)

    useEffect(() => {
        if(isNightModeOn) {
            document.body.classList.add('night-mode')
        } else {
            document.body.classList.remove('night-mode')
        }
    }, [isNightModeOn])

    return (
        <ThemeContext.Provider
            value={{ isNightModeOn, setNightModeOn }}
        >
            { children }
        </ThemeContext.Provider>
    )
}