import { useContext } from "react"
import { Link } from "react-router-dom"
import { ThemeContext } from "../../contexts/ThemeContext"
import { Container } from "react-bootstrap"
import './navbar.css'
import { Avatar } from "@mui/material"
import { useSession } from "../../custom-hooks/useSession"

export const NavBar = () => {
    const { isNightModeOn } = useContext(ThemeContext)
    const session = useSession()

    return (
        <nav className='py-3 px-5 custom-navbar'>
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center">
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
            </Container>
        </nav>
    )
}