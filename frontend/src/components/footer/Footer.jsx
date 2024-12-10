import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

export const Footer = () => {
    return (
        <footer className="w-100 bg-secondary">
            <Container>
                <Row className="p-3">
                    <Col sm={12} md={6}>
                        <ul className="d-flex flex-column gap-2 list-unstyled">
                            <li>About</li>
                            <li>
                                <Link to={'/credits'}>Credits</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col sm={12} md={6}>
                        <ul className="d-flex flex-column gap-2 align-items-md-end list-unstyled">
                            <li>
                                <Link to={'/terms-of-service'} target="_blank">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to={'/privacy'} target="_blank">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to={'/cookie-policy'} target="_blank">Cookie Policy</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col sm={12}>
                        <div className="text-center">© Heavenscopes 2024</div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}