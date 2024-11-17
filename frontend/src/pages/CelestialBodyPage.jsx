import { useEffect, useState } from "react"
import { RealTimeData } from "../components/celestial-body-components/real-time-data/RealTimeData"
import { Col, Container, Row } from "react-bootstrap"
import { ModelViewer } from "../components/celestial-body-components/model-3D/ModelViewer"
import { MediaSwiper } from "../components/celestial-body-components/official-media-visualization/MediaSwiper"

export const CelestialBodyPage = ({ bodyName = 'Mars' }) => {
    const [realTimeData, setRealTimeData] = useState(null)
    console.log(realTimeData)

    const getRealTimeData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/by-name/${bodyName.toLowerCase()}?media=true`)
            const data = await response.json()
            setRealTimeData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getRealTimeData()
    }, [])

    return (
        <Container>
            <Row>
                <h2>{bodyName}</h2>
            </Row>
            <Row>
                <Col sm={12} md={6}>
                    {realTimeData && (
                        <ModelViewer model3D={realTimeData.model3D} />
                    )}

                </Col>
                <Col sm={12} md={6}>
                    <RealTimeData bodyName={bodyName} />
                </Col>
            </Row>
            {realTimeData && realTimeData.licensedMedia.length > 0 && (
                <Row className="pt-5">
                    <h4>Official media</h4>
                    <MediaSwiper media={realTimeData.licensedMedia} />
                </Row>
            )}
        </Container>
    )
}