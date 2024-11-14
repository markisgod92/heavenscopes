import { ToggleButton, ToggleButtonGroup } from "react-bootstrap"

export const TimeOffsetSelector = ({ selectedTimeOffset, handleTimeOffset }) => {
    return (
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
    )
}