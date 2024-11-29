import { Row } from "react-bootstrap"
import { useSession } from "../custom-hooks/useSession"
import { RealTimeVisibility } from "../components/real-time-visibility/Real-Time-Visibility"
import { CreateNewPost } from "../components/post-components/CreateNewPost"
import { PostFeed } from "../components/post-components/PostFeed"

export const HomePage = () => {
    const session = useSession()

    return (
        <>
            <Row className="pt-3">
                <h3>Welcome {session.username}</h3>
            </Row>

            <Row className="pt-3">
                <RealTimeVisibility />
            </Row>

            <Row className="p-3">
                <CreateNewPost />
            </Row>

            <Row className="p-3">
                <PostFeed type={'feed'}/>
            </Row>
            
        </>
    )
}