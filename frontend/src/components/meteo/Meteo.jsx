import { useEffect, useState } from "react"
import { coordDecimalToString } from "../../utils/location-conversions"
import { useSession } from "../../custom-hooks/useSession"
import { convertMetersToMiles, unixUTCToTime } from "../../utils/conversions"
import './meteo.css'

export const Meteo = ({ data }) => {
    const { weather, main, visibility, clouds, dt, sys, coord } = data
    const [isNightTime, setNightTime] = useState(false)
    const { settings: { isMetric } } = useSession()

    useEffect(() => {
        const currentTime = Number(dt)
        const sunriseTime = Number(sys.sunrise)
        const sunsetTime = Number(sys.sunset)

        if (
            currentTime > sunsetTime ||
            currentTime < sunriseTime
        ) {
            setNightTime(true)
        } else {
            setNightTime(false)
        }
    }, [dt, sys.sunrise, sys.sunset])

    return (
        <div className={`p-3 rounded-3 border border-1 d-flex flex-column align-items-center gap-3 ${isNightTime ? 'weather-night' : 'weather-day'}`}>
            <div className="d-flex flex-column flex-md-row align-items-center gap-2 flex-wrap fw-bold">
                <span>Current weather at</span>
                <span>{coordDecimalToString(coord.lat, true)} / {coordDecimalToString(coord.lon, false)}</span>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <span>{weather[0].description} - temp: {main.temp}{isMetric ? '°C' : '°F'}</span>
                <span>Visibility: {isMetric ? `${visibility}mt` : `${convertMetersToMiles(visibility)}mi`}</span>
                <span>Clouds: {clouds.all}%</span>
            </div>

            <div className="d-flex align-items-center gap-3">
                <span>Sunrise: {unixUTCToTime(sys.sunrise)}</span>
                <span>Sunset: {unixUTCToTime(sys.sunset)}</span>
            </div>

            <div className="credit w-100 text-end">powered by OpenWeather</div>
        </div>
    )
}