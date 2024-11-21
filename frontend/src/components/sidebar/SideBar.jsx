import { useState } from "react"
import pages from '../../data/pagelist.json'
import { Link } from "react-router-dom"
import './sidebar.css'

export const SideBar = () => {
    return (
        <div className='sidebar'>
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
        </div>
    )
}