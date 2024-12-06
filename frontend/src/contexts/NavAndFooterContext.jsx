import { createContext } from "react"
import { NavBar } from "../components/navbar/NavBar"
import { Container } from "react-bootstrap"
import { Footer } from "../components/footer/Footer"

const NavAndFooterContext = createContext()

export const NavAndFooterProvider = ({ children }) => {
    return (
        <NavAndFooterContext.Provider
            value={''}
        >
            <NavBar />

            <Container>

                {children}

            </Container>

            <Footer />

        </NavAndFooterContext.Provider>
    )
}