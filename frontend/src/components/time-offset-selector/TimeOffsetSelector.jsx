import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import './timeoffsetselector.css'
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

export const TimeOffsetSelector = ({ selectedTimeOffset, setTimeOffset }) => {
    const {isNightModeOn} = useContext(ThemeContext)

    const changeTimeOffset = (event, value) => {
        setTimeOffset(value)
    }

    return (
        <div className={`d-flex justify-content-end ${isNightModeOn ? 'time-selector-night' : 'time-selector'}`}>
            <ToggleButtonGroup
                value={selectedTimeOffset}
                exclusive
                onChange={changeTimeOffset}
            >
                <ToggleButton
                    value={'now'}
                >
                    Now
                </ToggleButton>
                <ToggleButton
                    value={'threeH'}
                >
                    +3h
                </ToggleButton>
                <ToggleButton
                    value={'sixH'}
                >
                    +6h
                </ToggleButton>
                <ToggleButton
                    value={'twelveH'}
                >
                    +12h
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}