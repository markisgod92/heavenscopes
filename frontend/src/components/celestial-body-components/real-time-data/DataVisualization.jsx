import './datavisualization.css'

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
        <div className='h-100 p-3 d-flex flex-column justify-content-between gap-3 body-data-visualization'>

            <div className="d-flex flex-column gap-2">
                {body.name === 'Moon' && (
                     <div className="d-flex gap-3">
                     <span>Phase:</span>
                     <span>{parseInt(body.phase)}%</span>
                 </div>
                )}
                <div className="d-flex gap-3">
                    <span>Altitude:</span>
                    <span>{body.altitude.toFixed(2)}°</span>
                    {!body.aboveHorizon && <span className="text-danger">Not visible.</span>}
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

            <div className="d-flex flex-column gap-1 fw-light">
                <div className="d-flex gap-3">
                    <span>Updated:</span>
                    <span>{makeDateString(updated)}</span>
                </div>
                <div className="fst-italic">
                    <span>Powered by </span>
                    <a href="https://github.com/csymlstd/visible-planets-api.git">csymlstd / visible-planets-api</a>
                </div>
            </div>
        </div>
    )
}