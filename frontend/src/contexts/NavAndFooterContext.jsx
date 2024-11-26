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
            <div className="vh-100 d-flex flex-column justify-content-between">

                <NavBar />

                <LocationSettings />

                <Container fluid className="h-100 ps-0 flex-grow-1">
                    <Row className="h-100">

                        <Col xs={2} className="h-100">
                            <SideBar />
                        </Col>

                        <Col xs={10} className="h-100 overflow-y-scroll">
                                {children}
                        </Col>

                    </Row>
                </Container>

                <Footer />

            </div>
        </NavAndFooterContext.Provider>
    )
}