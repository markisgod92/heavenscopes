export const DataVisualization = ({ data }) => {
    const { updated, meta, body } = data

    const makeRAString = (value) => {
        const { hours, minutes, seconds } = value
        const output = `${value.negative ? '- ' : ''}${hours}h ${minutes}' ${seconds}''`
        return output
    }

    const makeDEString = (value) => {
        const { degrees, arcminutes, arcseconds } = value
        const output = `${value.negative ? '- ' : ''}${degrees}° ${arcminutes}' ${arcseconds}''`
        return output
    }

    const makeDateString = (date) => {
        return date.replace('T', ' ').split('.')[0]
    }

    return (
        <div className="h-100 d-flex flex-column justify-content-between">

            <div className="d-flex flex-column gap-2">
                <div className="d-flex gap-3">
                    <span>Altitude:</span>
                    <span>{body.altitude.toFixed(2)}°</span>
                    {!body.aboveHorizon && <div className="text-danger">Not visible.</div>}
                </div>
                <div className="d-flex gap-3">
                    <span>Azimuth:</span>
                    <span>{body.azimuth.toFixed(2)}°</span>
                </div>
                <div className="d-flex gap-3">
                    <span>Constellation:</span>
                    <span>{body.constellation}</span>
                </div>
                <div className="d-flex gap-3">
                    <span>Magnitude:</span>
                    <span>{body.magnitude.toFixed(2)}</span>
                </div>
                <div className="d-flex gap-3">
                    <span>Right ascension:</span>
                    <span>{makeRAString(body.rightAscension)}</span>
                </div>
                <div className="d-flex gap-3">
                    <span>Declination:</span>
                    <span>{makeDEString(body.declination)}</span>
                </div>
            </div>
            <div className="pt-3 d-flex flex-column gap-2">
                <div className="d-flex gap-3 fw-light">
                    <span>Updated:</span>
                    <span>{makeDateString(updated)}</span>
                </div>
                <div className="d-flex justify-content-between gap-2 fw-light">
                    <div className="d-flex gap-1">
                        <span>Location:</span>
                        <span>{meta.latitude}° {meta.longitude}°</span>
                    </div>
                    <div className="d-flex gap-1">
                        <span>Elevation:</span>
                        <span>{meta.elevation}m</span>
                    </div>
                </div>
            </div>
        </div>
    )
}