import { useEffect, useState } from "react"
import { BodyRealTimeData } from "../components/celestial-body-components/real-time-data/BodyRealTimeData"
import { Col, Row } from "react-bootstrap"
import { ModelViewer } from "../components/celestial-body-components/model-3D/ModelViewer"
import { MediaSwiper } from "../components/celestial-body-components/official-media-visualization/MediaSwiper"
import { useParams } from "react-router-dom"

export const CelestialBodyPage = () => {
    const {bodyName} = useParams()
    const [celestialBodyData, setCelestialBodyData] = useState(null)

    const getCelestialBodyData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/by-name/${bodyName.toLowerCase()}?media=true`)
            const data = await response.json()
            setCelestialBodyData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getCelestialBodyData()
    }, [bodyName])

    return (
        <>
            <Row className="pt-3">
                <h2>{bodyName}</h2>
            </Row>

            <Row>
                <Col sm={12} md={6}>
                    {celestialBodyData && (
                        <ModelViewer model3D={celestialBodyData.model3D} />
                    )}

                </Col>
                <Col sm={12} md={6}>
                    <BodyRealTimeData bodyName={bodyName} />
                </Col>
            </Row>

            {celestialBodyData && celestialBodyData.licensedMedia.length > 0 && (
                <Row className="pt-5">
                    <h4>Official media</h4>
                    <MediaSwiper media={celestialBodyData.licensedMedia} />
                </Row>

            )}
        </>
    )
}