import { useEffect, useState } from "react"
import { useSession } from "../../custom-hooks/useSession"
import { coordDecimalToString, mtToFt } from "../../utils/location-conversions"
import { SettingsModal } from "./SettingsModal"

export const LocationSettings = () => {
    const [sessionLocation, setSessionLocation] = useState({})
    const [sessionElevation, setSessionElevation] = useState(0)
    const { settings: { isMetric, location, elevation } } = useSession()
    const [isModalShown, setModalShown] = useState(false)

    const getDefaultSettings = () => {
        setSessionLocation(location)
        setSessionElevation(elevation)
    }

    const toggleModal = () => {
        setModalShown(prev => !prev)
    }

    useEffect(() => {
        getDefaultSettings()
    }, [])

    return (
        <div className='p-3 bg-dark d-flex justify-content-between'>
            <div className="d-flex gap-3 align-items-center">
                <div>
                    <i className="bi bi-compass"></i>
                </div>

                <div className="d-flex flex-wrap gap-md-2">
                    <div className="d-none d-md-block">Latitude:</div>
                    <div>{coordDecimalToString(sessionLocation.lat, true)}</div>
                </div>

                <div className="d-flex flex-wrap gap-md-2">
                    <div className="d-none d-md-block">Longitude:</div>
                    <div>{coordDecimalToString(sessionLocation.lon, false)}</div>
                </div>

                <div className="d-flex flex-wrap gap-md-2">
                    <div className="d-none d-md-block">Elevation:</div>
                    <div>{isMetric ? `${sessionElevation}m` : `${parseInt(mtToFt(sessionElevation))}ft`}</div>
                </div>
            </div>

            <button className="custom-link-button" onClick={toggleModal}>
                <span className="d-none d-md-block">Change settings</span>
                <span className="d-md-none">
                    <i className="bi bi-pencil-square"></i>
                </span>
            </button>

            <SettingsModal show={isModalShown} onHide={toggleModal}/>
        </div>
    )
}