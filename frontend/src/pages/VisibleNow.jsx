import { useContext, useState } from "react"
import { useSession } from "../custom-hooks/useSession"
import { RealTimeDataContext } from "../contexts/RealTimeDataContext"
import { Button, ButtonGroup, Row } from "react-bootstrap"
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { SkyMap } from "../components/sky-map/SkyMap"
import { RealTimeVisibility } from "../components/real-time-visibility/Real-Time-Visibility"
import { convertUTCString } from "../utils/date-conversion"

export const VisibleNow = () => {
    const session = useSession()
    const { data, isLoading, error, forceReload } = useContext(RealTimeDataContext)
    const [selectedTimeOffset, setSelectedTimeOffset] = useState('now')

    const changeTimeOffset = (event, value) => {
        setSelectedTimeOffset(value)
    }

    return (
        <>
            {data && (
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
                    </Row>

                    <Row className="pt-3 pb-5">
                        <RealTimeVisibility data={data[selectedTimeOffset].data}/>
                    </Row>
                </>
            )}
        </>
    )
}