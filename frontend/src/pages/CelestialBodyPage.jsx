import { useEffect, useState } from "react"
import { RealTimeData } from "../components/celestial-body-components/real-time-data/RealTimeData"
import { Col, Container, Row } from "react-bootstrap"
import { ModelViewer } from "../components/celestial-body-components/model-3D/ModelViewer"

export const CelestialBodyPage = ({bodyName = 'Mars'}) => {
    const [bodyData, setBodyData] = useState(null)
    console.log(bodyData)

    const getBodyData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/by-name/${bodyName.toLowerCase()}`)
            const data = await response.json()
            setBodyData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getBodyData()
    }, [])

    return (
        <Container>
            <Row>
                <Col sm={12} md={6}>
                {bodyData && (
                    <ModelViewer model3D={bodyData.model3D}/>
                )}
                    
                </Col>
                <Col sm={12} md={6}>
                    <RealTimeData bodyName={bodyName} />
                </Col>
            </Row>
        </Container>
    )
}