import { Row } from "react-bootstrap"
import { useSession } from "../custom-hooks/useSession"
import { RealTimeVisibility } from "../components/real-time-visibility/Real-Time-Visibility"

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
            
        </>
    )
}