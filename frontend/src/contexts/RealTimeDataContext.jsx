import { createContext, useState, useEffect } from "react";
import { makeTimeOffsets } from "../utils/makeTimeOffsets";

export const RealTimeDataContext = createContext()

export const RealTimeDataProvider = ({ children }) => {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const location = {lat: 45, lon: 12}
    const elevation = 0

    const fetchData = async (time) => {
        const response = await fetch(`https://api.visibleplanets.dev/v3?latitude=${location.lat}&longitude=${location.lon}&elevation=${elevation}&aboveHorizon=false&time=${time}`)
        const data = await response.json()
        return data
    }

    const loadData = async () => {
        setLoading(true)
        setError(null)
        const timeOffsets = makeTimeOffsets()

        try {
            const [ nowData, threeHData, sixHData, twelveHData ] = await Promise.all([
                fetchData(timeOffsets.now),
                fetchData(timeOffsets.plus3h),
                fetchData(timeOffsets.plus6h),
                fetchData(timeOffsets.plus12h)
            ])

            setData({
                updated: timeOffsets.now,
                now: nowData,
                threeH: threeHData,
                sixH: sixHData,
                twelveH: twelveHData
            })
        } catch (error) {
            setError('Real time data fetch error.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <RealTimeDataContext.Provider
            value={{ data, isLoading, error }}
        >
            { children }
        </RealTimeDataContext.Provider>
    )
}