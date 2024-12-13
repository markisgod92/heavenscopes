import { useEffect } from "react"
import { Container, Row } from "react-bootstrap"
import {useNavigate} from 'react-router-dom'

export const AccountCreated = () => {
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate('/feed')
        }, 1000)
    }, [])

    return (
        <Container>
            <Row className="text-center py-5">
                Account created successfully. You are now being redirected...
            </Row>
        </Container>
    )
}