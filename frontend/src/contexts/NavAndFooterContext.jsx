import { createContext } from "react"
import { NavBar } from "../components/navbar/NavBar"
import { LocationSettings } from "../components/location-settings/LocationSettings"
import { Col, Container, Row } from "react-bootstrap"
import { SideBar } from "../components/sidebar/SideBar"
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