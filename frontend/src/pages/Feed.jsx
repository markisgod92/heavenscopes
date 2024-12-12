import { Row, Col } from "react-bootstrap"
import { useSession } from "../custom-hooks/useSession"
import { PostFeed } from "../components/post-components/PostFeed"
import { LatestUploads } from "../components/mediaVisualization/LatestUploads"
import { Highlights } from "../components/celestial-body-components/real-time-data/Highlights"

export const Feed = () => {
    const session = useSession()

    return (
        <>
            <Row className="py-3">
                <h3>Welcome, {session.username}!</h3>
            </Row>

            <Row className="p-3">
                <Col sm={12}>
                    <h5>Visible now from your location</h5>
                </Col>
                <Col sm={12}>
                    <Highlights />
                </Col>
            </Row>

            <Row className="p-3">
                <Col sm={12}>
                    <h5>Latest uploads</h5>
                </Col>
                <Col sm={12}>
                    <LatestUploads />
                </Col>
            </Row>

            <Row className="p-3">
                <PostFeed type={'feed'} />
            </Row>

        </>
    )
}