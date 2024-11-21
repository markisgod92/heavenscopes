import pages from '../../data/pagelist.json'
import { Link } from "react-router-dom"
import './sidebar.css'
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export const SideBar = () => {
    const { isNightModeOn, setNightModeOn } = useContext(ThemeContext)

    const handleNightMode = (event, value) => {
        if(value !== null) {
            setNightModeOn(value)
        }   
    }

    return (
        <div className={`sidebar ${isNightModeOn ? 'sidebar-night' : 'sidebar-normal'}`}>
            <ul>
                {pages.map(page => (
                    <li key={`menu-${page.title}`}>
                        <Link to={page.url}>
                            {page.icon ? <i className={page.icon}></i> : <span className="planet-icon">{page.symbol}</span>}
                            <span className="menu-text">{page.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <ToggleButtonGroup
                value={isNightModeOn}
                exclusive
                onChange={handleNightMode}
                className='night-mode-switch'
            >
                <ToggleButton value={false}>
                    <i className="bi bi-eye"></i>
                </ToggleButton>
                <ToggleButton value={true}>
                    <i className="bi bi-binoculars"></i>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}