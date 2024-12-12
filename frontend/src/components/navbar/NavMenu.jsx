import { Link } from "react-router-dom"
import './navbar.css'
import { useContext, useState } from "react"
import pagelist from '../../data/pagelist.json'
import { ThemeContext } from "../../contexts/ThemeContext"
import { Tooltip } from '@mui/material'

export const NavMenu = () => {
    const [isObjectMenuOpen, setObjectMenuOpen] = useState(false)
    const { isNightModeOn, setNightModeOn } = useContext(ThemeContext)

    const toggleObjectMenu = () => setObjectMenuOpen(prev => !prev)

    const toggleNightMode = () => setNightModeOn(prev => !prev)

    return (
        <div className="p-0 w-100 overflow-x-auto d-flex justify-content-between ">
            {!isObjectMenuOpen && (
                <>
                    <ul className="m-0 list-unstyled d-flex align-items-center nav-menu ">
                        <li>
                            <Link to={'/feed'}>
                                <button>Feed</button>
                            </Link>
                        </li>

                        <li>
                            <Link to={'/visiblenow'}>
                                <button>Visible now</button>
                            </Link>
                        </li>

                        <li>
                            <button onClick={toggleObjectMenu}>Objects</button>
                        </li>
                    </ul>

                    <Tooltip title={isNightModeOn ? 'Turn Night Mode OFF' : 'Turn Night Mode ON'}>
                    <button onClick={toggleNightMode} className="night-mode-toggle">
                        {isNightModeOn ? <i className="bi bi-brightness-high"></i> : <i className="bi bi-binoculars"></i>}
                    </button>
                    </Tooltip>
                </>
            )}

            {isObjectMenuOpen && (
                <ul className="m-0 list-unstyled d-flex align-items-center nav-icons-menu">
                    <li>
                        <button onClick={toggleObjectMenu} className="menu-arrow-button">
                            <i className="bi bi-caret-left-fill"></i>
                        </button>
                    </li>
                    {pagelist.map(item => (
                        <li key={`nav-icon-${item.title}`}>
                            <Link to={item.url}>
                                <button className="icon-button">
                                    <img src={item.icon} />
                                    <span>{item.title}</span>
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}