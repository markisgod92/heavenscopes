import { Link } from "react-router-dom"
import './navbar.css'
import { useState } from "react"
import pagelist from '../../data/pagelist.json'

export const NavMenu = () => {
    const [isObjectMenuOpen, setObjectMenuOpen] = useState(false)

    const toggleObjectMenu = () => setObjectMenuOpen(prev => !prev)

    return (
        <div className="p-0 w-100 overflow-x-auto">
            {!isObjectMenuOpen && (
                <ul className="m-0 list-unstyled d-flex align-items-center nav-menu">
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
            )}

            {isObjectMenuOpen && (
                <ul className="m-0 list-unstyled d-flex align-items-center nav-icons-menu">
                    <li>
                        <button onClick={toggleObjectMenu} className="menu-arrow-button">
                            <i class="bi bi-caret-left-fill"></i>
                        </button>
                    </li>
                    {pagelist.map(item => (
                        <li>
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