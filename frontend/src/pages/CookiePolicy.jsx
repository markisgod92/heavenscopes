import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export const CookiePolicy = () => {
    const navigate = useNavigate()
    
    return (
        <Container>
            <Row className="d-flex justify-content-center p-5">
                <img src="/heavenscope-high-resolution-logo-transparent.png" alt="heavenscopes-logo" className="login-page-logo" role='button' onClick={() => navigate('/feed')}/>
            </Row>
            
            <Row className="pt-3">
                <Col sm={12}>
                    <h3 className="text-center">Cookie Policy</h3>
                </Col>

                <Col sm={12} className="pt-3">
                    <p>Effective date: Dec. 10, 2024</p>
                    <p>Heavenscopes does not use cookies on its platform. Instead, we use local storage to store your login token for authentication.</p>
                    <p>Local storage ensures a seamless experience while keeping your data local to your browser. If you wish to clear this data, you can do so through your browser settings.</p>
                </Col>
            </Row>
        </Container>
    )
}