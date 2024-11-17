import { useEffect, useState } from "react"
import { useSession } from "../../custom-hooks/useSession"
import { coordDecimalToString, mtToFt } from "../../utils/location-conversions"
import './locationsettings.css'
import { Col, Form } from "react-bootstrap"

export const LocationSettings = () => {
    const [sessionLocation, setSessionLocation] = useState({})
    const [sessionElevation, setSessionElevation] = useState(0)
    const { settings: { isMetric, location, elevation } } = useSession()
    const [isModifyOn, setModifyOn] = useState(false)

    const getDefaultSettings = () => {
        setSessionLocation(location)
        setSessionElevation(elevation)
    }

    const toggleModifyMode = () => {
        setModifyOn(prev => !prev)
    }

    useEffect(() => {
        getDefaultSettings()
    }, [])

    return (
        <div className="d-flex justify-content-between">

                <>
                    <div className="d-flex gap-3">
                        <div>Current settings:</div>
                        <div>Latitude: {coordDecimalToString(sessionLocation.lat, true)}</div>
                        <div>Longitude: {coordDecimalToString(sessionLocation.lon, false)}</div>
                        <div>Elevation: {isMetric ? `${sessionElevation}m` : `${mtToFt(sessionElevation)}ft`}</div>
                    </div>

                    <button className="link-button" onClick={toggleModifyMode}>Change settings</button>
                </>


            
        </div>

    )
}