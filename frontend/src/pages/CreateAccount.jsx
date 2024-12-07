import { Container, Row } from "react-bootstrap"
import { UserForm } from "../components/user-management/UserForm"


export const CreateAccount = () => {
    return (
        <Container>
            <Row className="d-flex justify-content-center p-5">
                <img src="/heavenscope-high-resolution-logo-transparent.png" alt="heavenscopes-logo" className="login-page-logo" />
            </Row>

            <Row className="pb-5">
                <p>By signing up, you will gain access to detailed planetary visibility data and our social features, including the ability to share posts and media with your friends.</p> 
                <p>Enjoy a more personalized experience and connect with fellow enthusiasts!</p>
            </Row>

            <Row className="p-1">
                <UserForm />
            </Row>
        </Container>
    )
}