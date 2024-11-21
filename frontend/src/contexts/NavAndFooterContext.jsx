import { createContext, useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import { NavBar } from "../components/navbar/NavBar"
import { LocationSettings } from "../components/location-settings/LocationSettings"
import { Col, Container, Row } from "react-bootstrap"
import { SideBar } from "../components/sidebar/SideBar"
import { Footer } from "../components/footer/Footer"

const NavAndFooterContext = createContext()

export const NavAndFooterProvider = ({ children }) => {
    const { isNightModeOn } = useContext(ThemeContext)

    return (
        <NavAndFooterContext.Provider
            value={''}
        >
            <div className="vh-100 d-flex flex-column justify-content-between">
                <div className={
                    `h-100 d-flex flex-column ${isNightModeOn ? 'bg-black text-danger' : 'body-container'}`
                }>
                    <NavBar />
                    <LocationSettings />
                    <Container fluid className="h-100 ps-0">
                        <Row className="h-100">
                            <Col xs={2} lg={2}>
                                <SideBar />
                            </Col>
                            <Col xs={10} lg={10}>
                                {children}
                            </Col>
                        </Row>
                    </Container>  
                </div>
                <Footer />
            </div>
        </NavAndFooterContext.Provider>
    )
}