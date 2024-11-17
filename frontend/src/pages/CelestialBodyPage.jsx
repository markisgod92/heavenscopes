import { useEffect, useState } from "react"
import { RealTimeData } from "../components/celestial-body-components/real-time-data/RealTimeData"
import { Col, Container, Row } from "react-bootstrap"
import { ModelViewer } from "../components/celestial-body-components/model-3D/ModelViewer"
import { MediaSwiper } from "../components/celestial-body-components/official-media-visualization/MediaSwiper"
import { LocationSettings } from "../components/location-settings/LocationSettings"

export const CelestialBodyPage = ({ bodyName = 'Mars' }) => {
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
    }, [])

    return (
        <Container>
            <Row>
                <LocationSettings />
            </Row>
            <Row>
                <h2>{bodyName}</h2>
            </Row>
            <Row>
                <Col sm={12} md={6}>
                    {celestialBodyData && (
                        <ModelViewer model3D={celestialBodyData.model3D} />
                    )}

                </Col>
                <Col sm={12} md={6}>
                    <RealTimeData bodyName={bodyName} />
                </Col>
            </Row>
            {celestialBodyData && celestialBodyData.licensedMedia.length > 0 && (
                <Row className="pt-5">
                    <h4>Official media</h4>
                    <MediaSwiper media={celestialBodyData.licensedMedia} />
                </Row>
            )}
        </Container>
    )
}