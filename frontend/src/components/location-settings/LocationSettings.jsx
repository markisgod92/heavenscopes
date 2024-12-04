import { useEffect, useState } from "react"
import { useSession } from "../../custom-hooks/useSession"
import { coordDecimalToString, mtToFt } from "../../utils/location-conversions"
import './locationsettings.css'

export const LocationSettings = () => {
    const [sessionLocation, setSessionLocation] = useState({})
    const [sessionElevation, setSessionElevation] = useState(0)
    const { settings: { isMetric, location, elevation } } = useSession()

    const getDefaultSettings = () => {
        setSessionLocation(location)
        setSessionElevation(elevation)
    }

    useEffect(() => {
        getDefaultSettings()
    }, [])

    return (
        <div className='location-settings bg-dark text-light p-1 px-3 d-flex justify-content-between'>
            <div className="d-flex gap-3 align-items-center">
                <div>
                    <i className="bi bi-compass"></i>
                </div>

                <div className="d-flex flex-wrap gap-md-2">
                    <div>Latitude:</div>
                    <div>{coordDecimalToString(sessionLocation.lat, true)}</div>
                </div>

                <div className="d-flex flex-wrap gap-md-2">
                    <div>Longitude:</div>
                    <div>{coordDecimalToString(sessionLocation.lon, false)}</div>
                </div>

                <div className="d-flex flex-wrap gap-md-2">
                    <div>Elevation:</div>
                    <div>{isMetric ? `${sessionElevation}m` : `${parseInt(mtToFt(sessionElevation))}ft`}</div>
                </div>
            </div>

            <button className="link-button">Change settings</button>
        </div>
    )
}