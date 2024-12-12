import { useContext, useEffect, useState } from "react"
import { RealTimeDataContext } from "../../../contexts/RealTimeDataContext"
import {SkyRadar} from '../../sky-radar/SkyRadar'
import pagelist from '../../../data/pagelist.json'

export const Highlights = () => {
    const { data, isLoading, error, forceReload } = useContext(RealTimeDataContext)
    const [visibleNow, setVisibleNow] = useState([])

    useEffect(() => {
        if(data && data.now) {
            setVisibleNow(data.now.data.filter(body => body.aboveHorizon && body.name !== 'Pluto'))
        }
    }, [data])

    return (
        <>
        {visibleNow && (
            <SkyRadar planets={visibleNow}/>
        )}
        </>
    )
}