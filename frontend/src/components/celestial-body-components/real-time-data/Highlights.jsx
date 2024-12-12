import { useContext, useEffect, useState } from "react"
import { RealTimeDataContext } from "../../../contexts/RealTimeDataContext"
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
            <ul className="list-unstyled d-flex gap-3">
                {visibleNow.map((body, i) => (
                    <li key={`highlight-${i}`}>
                        <img src={pagelist.find(item => item.title === body.name).icon} />
                    </li>
                ))}
            </ul>
        )}
        </>
    )
}