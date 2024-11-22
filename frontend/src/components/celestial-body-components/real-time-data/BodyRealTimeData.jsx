import { useContext, useEffect, useState } from "react"
import { RealTimeDataContext } from "../../../contexts/RealTimeDataContext"
import { TimeOffsetSelector } from "../../time-offset-selector/TimeOffsetSelector"
import { DataVisualization } from "./DataVisualization"
import { CircularProgress, IconButton } from "@mui/material";

export const BodyRealTimeData = ({ bodyName }) => {
    const { data, isLoading, error, forceReload } = useContext(RealTimeDataContext)
    const [selectedTimeOffset, setSelectedTimeOffset] = useState('now')
    const [readingData, setReadingData] = useState(null)

    const makeReadingData = () => {
        if (data && data[selectedTimeOffset]) {
            const selectedBody = data[selectedTimeOffset].data.find(item => item.name === bodyName)
            setReadingData({
                updated: data.updated,
                meta: data[selectedTimeOffset].meta,
                body: selectedBody
            })
        }
    }

    useEffect(() => {
        makeReadingData()
    }, [data, selectedTimeOffset, bodyName])

    useEffect(() => {
        setSelectedTimeOffset('now')
    }, [bodyName])

    return (
        <div className="h-100">
            {isLoading && !error && (
                <div className="pt-5 h-100 d-flex flex-column gap-3 align-items-center align-items-center">
                    <CircularProgress />
                    <span>Loading visibility data...</span>
                </div>
            )}

            {!isLoading && error && (
                <div className="pt-5 h-100 d-flex flex-column gap-1 align-items-center align-items-center">
                    {error}
                    <IconButton onClick={forceReload}>
                        <i className="bi bi-arrow-clockwise text-white"></i>
                    </IconButton>
                    <span>Try again</span>
                </div>
            )}

            {!isLoading && !error && readingData && (
                <div className="h-100 d-flex flex-column">
                    <TimeOffsetSelector selectedTimeOffset={selectedTimeOffset} setTimeOffset={setSelectedTimeOffset} />

                    <DataVisualization data={readingData} />
                </div>
            )}
        </div>
    )
}