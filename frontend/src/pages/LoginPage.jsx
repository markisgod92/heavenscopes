import { useState } from "react"
import { Form, Button, Spinner } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

export const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })
    const [isLoading, setLoading] = useState(false)
    const [formMessages, setFormMessages] = useState(null)
    const navigate = useNavigate()

    const handleDataChange = (e) => {
        const { name, value } = e.target
        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const validateForm = () => {
        const tempErrors = {}
        let isValid = true

        if (!loginData.username) {
            tempErrors.username = 'Username needed.'
            isValid = false
        }

        if (loginData.password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters long.'
            isValid = false
        }

        setFormMessages(tempErrors)
        return isValid
    }

    const redirect = () => {
        setTimeout(() => {
            navigate('/feed')
        }, 500)
    }

    const login = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!validateForm()) {
            setLoading(false)
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            const data = await response.json()

            if (response.ok) {
                const authToken = JSON.stringify(response.headers.get('Authorization'))
                localStorage.setItem('Authorization', authToken)
                setFormMessages({
                    login: 'Login successful. Redirecting...'
                })
                redirect()
            } else {
                setFormMessages({
                    fetch: data.message || 'Login failed.'
                })
            }
        } catch (error) {
            setFormMessages({
                fetch: error.message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page py-5">

            <img src="/heavenscope-high-resolution-logo-transparent.png" alt="heavenscopes-logo" className="login-page-logo" />

            <div className="d-flex flex-column align-items-center gap-5 welcome-message">
                <div className="d-flex flex-column align-items-center">
                    <span>TRACK</span>
                    <span>Plan your next celestial observation with real-time planetary data.</span>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <span>CAPTURE</span>
                    <span>Showcase the cosmos with your stunning astrophotography.</span>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <span>CONNECT</span>
                    <span>Share your passion and media with a fellow stargazers.</span>
                </div>
            </div>

            <div className="h-100 d-flex flex-column align-items-center gap-5">
                <Form
                    onSubmit={login}
                    className="d-flex flex-column gap-3"
                >
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleDataChange}
                    />
                    {formMessages && formMessages.username && (
                        <Form.Text className="text-danger text-end">{formMessages.username}</Form.Text>
                    )}
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleDataChange}
                    />
                    {formMessages && formMessages.password && (
                        <Form.Text className="text-danger text-end">{formMessages.password}</Form.Text>
                    )}
                    <div className="d-flex justify-content-center">
                        <button type='submit' className="form-button">
                            {isLoading ? (
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                />
                            ) : (
                                <span>Login</span>
                            )}
                        </button>
                    </div>
                    {formMessages && formMessages.fetch && (
                        <Form.Text className="text-danger text-center">{formMessages.fetch}</Form.Text>
                    )}
                    {formMessages && formMessages.login && (
                        <Form.Text className="text-success text-center">{formMessages.login}</Form.Text>
                    )}
                </Form>

                <Link to={'/register'} className="fw-bold">Create account</Link>
            </div>

        </div>
    )
}