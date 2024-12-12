import { useContext, useEffect, useState } from "react"
import { RealTimeDataContext } from "../contexts/RealTimeDataContext"
import { Row, Spinner } from "react-bootstrap"
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { SkyMap } from "../components/sky-map/SkyMap"
import { RealTimeVisibility } from "../components/real-time-visibility/Real-Time-Visibility"
import { convertUTCString } from "../utils/date-conversion"
import { Meteo } from "../components/meteo/Meteo"

export const VisibleNow = () => {
    const { data, isLoading, error, forceReload } = useContext(RealTimeDataContext)
    const [selectedTimeOffset, setSelectedTimeOffset] = useState('now')

    const changeTimeOffset = (event, value) => {
        setSelectedTimeOffset(value)
    }

    useEffect(() => {
        forceReload()
    }, [])

    return (
        <>
            {isLoading && !error && (
                <div className="p-5 d-flex justify-content-center align-items-center">
                    <Spinner 
                        animation="grow"
                        size="lg"
                        role="status"
                    />
                </div>
            )}

            {!isLoading && error && (
                <div className="p-5 d-flex flex-column gap-4 align-items-center">
                    <span>{error || 'Data not available.'}</span>
                    <button className="form-button" onClick={forceReload}>Reload</button>
                </div>
            )}
            {!isLoading && !error && data && (
                <>
                    <Row className="p-3 time-offset-selector">
                        <ToggleButtonGroup
                            value={selectedTimeOffset}
                            exclusive
                            onChange={changeTimeOffset}
                        >
                            <ToggleButton value={'now'}>
                                Now
                            </ToggleButton>

                            <ToggleButton value={'threeH'}>
                                +3h
                            </ToggleButton>

                            <ToggleButton value={'sixH'}>
                                +6h
                            </ToggleButton>

                            <ToggleButton value={'twelveH'}>
                                +12h
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Row>

                    <Row>
                        <div className="p-1 d-flex justify-content-center">
                            <div>{convertUTCString(data[selectedTimeOffset].meta.time)}</div>
                        </div>
                    </Row>

                    <Row>
                        <SkyMap data={data[selectedTimeOffset].data} meta={data[selectedTimeOffset].meta} />

                        <div className="p-3 text-center">The map does not represent the current lighting or weather conditions.</div>
                    </Row>

                    <Row className="p-3">
                        <Meteo data={data.meteo}/>
                    </Row>

                    <Row className="pt-3 pb-5">
                        <RealTimeVisibility data={data[selectedTimeOffset].data}/>
                    </Row>
                </>
            )}
        </>
    )
}