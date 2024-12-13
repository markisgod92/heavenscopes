import { Col, Container, Row } from "react-bootstrap"
import {useNavigate} from 'react-router-dom'

export const TermsOfService = () => {
    const navigate = useNavigate()

    return (
        <Container>
            <Row className="d-flex justify-content-center p-5">
                <img src="/heavenscope-high-resolution-logo-transparent.png" alt="heavenscopes-logo" className="login-page-logo" role='button' onClick={() => navigate('/feed')}/>
            </Row>
            
            <Row className="pt-3">
                <Col sm={12}>
                    <h3 className="text-center">Terms of Service</h3>
                </Col>

                <Col sm={12} className="pt-3">
                    <p>Effective date: Dec. 10, 2024</p>
                    <p>Welcome to Heavenscopes! By using our services, you agree to these terms.</p>

                    <ol className="d-flex flex-column gap-3">
                        <li>
                            <h5>What We Offer:</h5>
                            <ul>
                                <li>Access to planetary position data and weather data for astronomical observations.</li>
                                <li>Tools to share and view posts, media and comments.</li>
                                <li>Interaction with a community of astronomy enthusiasts.</li>
                            </ul>
                        </li>

                        <li>
                            <h5>Rules for Users:</h5>
                            <ul>
                                <li>Heavenscopes is a platform for sharing passion and knowledge about astronomy.</li>
                                <li>Do not post offensive or false content.</li>
                                <li>Respect other users and keep interactions civil.</li>
                            </ul>
                        </li>

                        <li>
                            <h5>Account Violations:</h5>
                            <p>Any violation of the rules may result in the removal of your account without prior notice.</p>
                        </li>

                        <li>
                            <h5>Disclaimer</h5>
                            <p>Heavenscopes does not guarantee the accuracy of the astronomical data provided. Use it at your discretion.</p>
                        </li>

                        <li>
                            <h5>Cost</h5>
                            <p>All features of Heavenscopes are provided free of charge.</p>
                        </li>
                    </ol>
                </Col>
            </Row>
        </Container>
    )
}