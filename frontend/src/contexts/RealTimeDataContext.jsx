import { useRealTimeData } from "../custom-hooks/useRealTimeData";
import { createContext } from "react";

export const RealTimeDataContext = createContext()

export const RealTimeDataProvider = ({ children }) => {
    const { data, isLoading, error } = useRealTimeData({lat: 45, lon: 12}, 0)

    return (
        <RealTimeDataContext.Provider
            value={{ data, isLoading, error }}
        >
            { children }
        </RealTimeDataContext.Provider>
    )
}