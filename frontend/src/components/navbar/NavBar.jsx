import { useContext } from "react"
import { Link } from "react-router-dom"
import { ThemeContext } from "../../contexts/ThemeContext"
import { Container } from "react-bootstrap"
import './navbar.css'

export const NavBar = () => {
    const { isNightModeOn, toggleNightMode } = useContext(ThemeContext)

    return (
        <nav className={`py-3 px-5 ${isNightModeOn ? 'navbar-night' : 'navbar-normal'}`}>
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center">
                    <Link to={'/home'}>
                        <img
                            src={isNightModeOn ? '/heavenscope-high-resolution-logo-grayscale-transparent.png' : '/heavenscope-high-resolution-logo-transparent.png'}
                            alt="heavenscopes-logo"
                            className="nav-logo"
                        />
                    </Link>
                
                </div>
            </Container>
        </nav>
    )
}