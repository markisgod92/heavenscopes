import { Container, Row } from "react-bootstrap"
import { UserForm } from "../components/user-management/UserForm"


export const CreateAccount = () => {
    return (
        <Container>
            <Row>
                <UserForm />
            </Row>
        </Container>
    )
}