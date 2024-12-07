import { useState } from "react"
import { Row, Col, Form } from "react-bootstrap"
import { ftToMt } from "../../utils/location-conversions"
import { SettingsForm } from "./SettingsForm"
import { useNavigate } from "react-router-dom"

export const UserForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        bio: '',
        settings: {
            isMetric: true,
            location: {
                lat: undefined,
                lon: undefined
            },
            elevation: 0
        }
    })
    const [profilePic, setProfilePic] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0])
    }

    const handleSettingsUpdate = (settings) => {
        setFormData({
            ...formData,
            settings: settings
        })
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.username.trim() || formData.username.trim().length < 3) {
            errors.username = 'Username must be at least 3 characters long.'
        }

        if (!formData.email.includes('@')) {
            errors.email = 'Invalid email address.'
        }

        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.'
        }

        if (formData.bio.length > 100) {
            errors.bio = 'Cannot exceed 100 characters.'
        }

        return errors
    }

    const uploadAvatar = async (file) => {
        const fileData = new FormData()
        fileData.append('avatar', file)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/upload`, {
                method: 'POST',
                body: fileData
            })
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    const createUser = async (e) => {
        e.preventDefault()

        const errors = validateForm()
        setValidationErrors(errors)
        console.log(errors)

        if (Object.keys(errors).length > 0) {
            return
        }

        let postFormData = { ...formData }

        if (profilePic) {
            const uploadedAvatar = await uploadAvatar(profilePic)
            postFormData = {
                ...postFormData,
                profilePic: uploadedAvatar.avatar
            }
        }

        if (!postFormData.settings.isMetric) {
            postFormData = {
                ...postFormData,
                settings: {
                    ...postFormData.settings,
                    elevation: ftToMt(postFormData.settings.elevation)
                }
            }
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/new`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(postFormData)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Error creating user.')
            }

            const token = response.headers.get('Authorization')
            localStorage.setItem('Authorization', JSON.stringify(token))
            navigate('/new-user-redirect')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form className="d-flex flex-column gap-3">
            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Username
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Control
                        type="text"
                        name='username'
                        isInvalid={!!validationErrors.username}
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.username}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Email
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Control
                        type="email"
                        name='email'
                        isInvalid={!!validationErrors.email}
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.email}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Password
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Control
                        type="password"
                        name='password'
                        isInvalid={!!validationErrors.password}
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.password}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Avatar
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Control
                        type="file"
                        name='avatar'
                        onChange={handleFileChange}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Bio
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        name='bio'
                        className="bio-textarea"
                        isInvalid={!!validationErrors.bio}
                        value={formData.bio}
                        onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.bio}
                    </Form.Control.Feedback>
                </Col>
                <Form.Text className={`text-end ${formData.bio.length > 100 ? 'text-danger' : ''}`}>
                    {formData.bio.length}/100
                </Form.Text>
            </Form.Group>

            <Row>
                Settings
            </Row>

            <SettingsForm onUpdate={handleSettingsUpdate} />

            <div className="d-flex justify-content-center p-5">
                <button type="submit" onClick={createUser} className="form-button">Register</button>
            </div>
        </Form>
    )
}