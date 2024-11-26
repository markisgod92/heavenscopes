import { useEffect, useState } from "react"
import { useSession } from "../../custom-hooks/useSession"
import { coordDecimalToString, mtToFt } from "../../utils/location-conversions"
import './locationsettings.css'
import { Container } from "react-bootstrap"

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
        <div className='location-settings'>
            <Container >
                <div className='d-flex justify-content-between'>
                    <div className="d-flex gap-3">
                        <div>Current settings:</div>
                        <div>Latitude: {coordDecimalToString(sessionLocation.lat, true)}</div>
                        <div>Longitude: {coordDecimalToString(sessionLocation.lon, false)}</div>
                        <div>Elevation: {isMetric ? `${sessionElevation}m` : `${parseInt(mtToFt(sessionElevation))}ft`}</div>
                    </div>

                    <button className="link-button">Change settings</button>
                </div>
            </Container>
        </div>
    )
}