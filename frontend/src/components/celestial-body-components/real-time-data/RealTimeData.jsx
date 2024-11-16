import { useContext, useEffect, useState } from "react"
import { RealTimeDataContext } from "../../../contexts/RealTimeDataContext"
import { TimeOffsetSelector } from "./TimeOffsetSelector"
import { DataVisualization } from "./DataVisualization"

export const RealTimeData = ({ bodyName }) => {
    const { data, isLoading, error } = useContext(RealTimeDataContext)
    const [selectedTimeOffset, setSelectedTimeOffset] = useState('now')
    const [readingData, setReadingData] = useState(null)

    const handleTimeOffset = (value) => {
        setSelectedTimeOffset(value)
    }

    const makeReadingData = () => {
        if(data && data[selectedTimeOffset]) {
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

    return (
        <div className="h-100">
            {isLoading && !error && <div>loading...</div>}

            {!isLoading && error && <div>{error}</div>}

            {!isLoading && !error && readingData ? (
                <div className="h-100 d-flex flex-column gap-5">
                    <TimeOffsetSelector selectedTimeOffset={selectedTimeOffset} handleTimeOffset={handleTimeOffset}/>

                    <DataVisualization data={readingData}/>
                </div>
            ) : (
                <div>Data not available.</div>
            )}
        </div>
    )
}