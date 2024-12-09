import { useEffect, useState } from "react"
import { BodyRealTimeData } from "../components/celestial-body-components/real-time-data/BodyRealTimeData"
import { Col, Row } from "react-bootstrap"
import { ModelViewer } from "../components/celestial-body-components/model-3D/ModelViewer"
import { useParams } from "react-router-dom"
import { PostFeed } from "../components/post-components/PostFeed"
import { LatestUploads } from "../components/mediaVisualization/LatestUploads"

export const CelestialBodyPage = () => {
    const { bodyName } = useParams()
    const [celestialBodyData, setCelestialBodyData] = useState(null)

    const getCelestialBodyData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/by-name/${bodyName}?media=true`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
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

            <Row className="pb-3">
                <Col sm={12} md={6}>
                    {celestialBodyData && (
                        <ModelViewer model3D={celestialBodyData.model3D} />
                    )}

                </Col>
                <Col sm={12} md={6}>
                    <BodyRealTimeData bodyName={bodyName} />
                </Col>
            </Row>

            <Row className="p-3">
                <Col sm={12}>
                    <h5>Latest uploads</h5>
                </Col>
                <Col sm={12}>
                {celestialBodyData && (
                    <LatestUploads type={'bodyId'} id={celestialBodyData._id}/>
                )}
                </Col>
            </Row>

            <Row className="p-3">
                {celestialBodyData && (
                    <PostFeed type={'by-body'} id={celestialBodyData._id} />
                )}
            </Row>
        </>
    )
}