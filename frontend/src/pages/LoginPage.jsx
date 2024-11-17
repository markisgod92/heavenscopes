import { useState } from "react"
import { Form, Button, Spinner } from "react-bootstrap"

export const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        username: import.meta.env.VITE_TEST_USERNAME,
        password: import.meta.env.VITE_TEST_PASSWORD
    })
    const [isLoading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)

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

        setErrors(tempErrors)
        return isValid
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

            if (!response.ok) {
                setErrors({
                    fetch: data.message
                })
            }

            const authToken = JSON.stringify(response.headers.get('Authorization'))
            localStorage.setItem('Authorization', authToken)
        } catch (error) {
            setErrors({
                fetch: error.message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
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
                {errors && errors.username && (
                    <Form.Text className="text-danger text-end">{errors.username}</Form.Text>
                )}
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleDataChange}
                />
                {errors && errors.password && (
                    <Form.Text className="text-danger text-end">{errors.password}</Form.Text>
                )}
                <div className="d-flex justify-content-center">
                    <Button type='Submit'>
                        {isLoading && (
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                            />
                        )}
                        <span>Login</span>
                    </Button>
                </div>
                {errors && errors.fetch && (
                    <Form.Text className="text-danger text-center">{errors.fetch}</Form.Text>
                )}
            </Form>
        </div>
    )
}