import { useEffect, useState } from "react"
import { makeTimeOffsets } from "../utils/makeTimeOffsets"

export const useRealTimeData = (location, elevation) => {
    const [data, setData] = useState({
        now: null,
        threeH: null,
        sixH: null,
        twelveH: null
    })
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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

    useEffect(() => {
        const intervalId = setInterval(loadData, 60 * 60 * 1000)
        return () => clearInterval(intervalId)
    }, [])

    return { data, isLoading, error }
}