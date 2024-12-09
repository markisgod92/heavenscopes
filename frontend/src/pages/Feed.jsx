import { Row, Col } from "react-bootstrap"
import { useSession } from "../custom-hooks/useSession"
import { CreateNewPost } from "../components/post-components/CreateNewPost"
import { PostFeed } from "../components/post-components/PostFeed"
import { LatestUploads } from "../components/mediaVisualization/LatestUploads"

export const Feed = () => {
    const session = useSession()

    return (
        <>
            <Row className="py-3">
                <h3>Welcome, {session.username}!</h3>
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