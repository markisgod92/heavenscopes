import { createContext, useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import { NavBar } from "../components/navbar/NavBar"
import { LocationSettings } from "../components/location-settings/LocationSettings"
import { Col, Container, Row } from "react-bootstrap"

const NavAndFooterContext = createContext()

export const NavAndFooterProvider = ({ children }) => {
    const { isNightModeOn } = useContext(ThemeContext)

    return (
        <NavAndFooterContext.Provider
            value={''}
        >
            <div className={
                `vh-100 d-flex flex-column ${isNightModeOn ? 'bg-black text-danger' : 'body-container'}`
            }>
                <NavBar />
                <LocationSettings />
                <Container>
                    <Row>
                        <Col xs={2} lg={3}>
                            
                        </Col>
                        <Col xs={10} lg={9}>
                            {children}
                        </Col>
                    </Row>
                </Container>
            </div>
        </NavAndFooterContext.Provider>
    )
}