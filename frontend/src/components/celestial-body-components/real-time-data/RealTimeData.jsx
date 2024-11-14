import { useContext, useState } from "react"
import { RealTimeDataContext } from "../../../contexts/RealTimeDataContext"
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap"

export const RealTimeData = ({ bodyName = 'Mars' }) => {
    const { data, isLoading, error } = useContext(RealTimeDataContext)
    const [selectedTimeOffset, setSelectedTimeOffset] = useState('now')

    const handleTimeOffset = (value) => {
        setSelectedTimeOffset(value)
        console.log(value)
    }

    return (
        <div>
            {isLoading && <div>loading...</div>}

            {error && <div>{error}</div>}

            {data && (
                <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-1">
                        <ToggleButtonGroup
                            type="radio"
                            name="timeOffset"
                            value={selectedTimeOffset}
                            onChange={handleTimeOffset}
                        >
                            <ToggleButton
                                id="now-btn"
                                value={'now'}
                            >
                                Now
                            </ToggleButton>
                            <ToggleButton
                                id="threeH-btn"
                                value={'threeH'}
                            >
                                +3h
                            </ToggleButton>
                            <ToggleButton
                                id="sixH-btn"
                                value={'sixH'}
                            >
                                +6h
                            </ToggleButton>
                            <ToggleButton
                                id="twelveH-btn"
                                value={'twelveH'}
                            >
                                +12h
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div>
                        {JSON.stringify(data[selectedTimeOffset].data.find(item => item.name === bodyName))}
                    </div>
                </div>
            )}
        </div>
    )
}