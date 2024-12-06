import { useContext } from "react"
import { Link, NavLink } from "react-router-dom"
import { ThemeContext } from "../../contexts/ThemeContext"
import { Container, Row } from "react-bootstrap"
import './navbar.css'
import { Avatar } from "@mui/material"
import { useSession } from "../../custom-hooks/useSession"
import { LocationSettings } from "../location-settings/LocationSettings"
import { NavMenu } from "./NavMenu"

export const NavBar = () => {
    const { isNightModeOn } = useContext(ThemeContext)
    const session = useSession()

    return (
        <nav className='custom-navbar'>
            <Container fluid>
                <Row >
                    <div className="p-3 d-flex justify-content-between align-items-center">
                        <Link to={'/home'}>
                            <img
                                src={isNightModeOn ? '/heavenscope-high-resolution-logo-grayscale-transparent.png' : '/heavenscope-high-resolution-logo-transparent.png'}
                                alt="heavenscopes-logo"
                                className="nav-logo"
                            />
                        </Link>

                        <Link to={`/profile/${session.id}`}>
                            <Avatar
                                src={session.profilePic}
                                alt={session.username}
                                sx={{ width: 56, height: 56 }}
                            />
                        </Link>
                    </div>
                </Row>

                <Row>
                    <LocationSettings />
                </Row>

                <Row className="pb-0">
                    <NavMenu />
                </Row>
            </Container>
        </nav>
    )
}