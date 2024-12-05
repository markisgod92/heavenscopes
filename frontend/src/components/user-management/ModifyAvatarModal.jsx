import { useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import './modifyavatarmodal.css'
import { CustomError } from "../../utils/custom-error"

export const ModifyAvatarModal = ({ userId, show, handleClose }) => {
    const [file, setFile] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleFileChange = (e) => {
        setError(null)
        setFile(e.target.files[0])
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

    const updateUser = async (e) => {
        e.preventDefault()

        setLoading(true)
        const token = JSON.parse(localStorage.getItem('Authorization'))

        try {
            const uploadedAvatar = await uploadAvatar(file)

            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({profilePic: uploadedAvatar.avatar})
            })
            
            if(!response.ok) {
                const data = await response.json()
                throw new CustomError(data.statusCode, data.message)
            }

            localStorage.setItem('Authorization', JSON.stringify(response.headers.get('Authorization')))
            window.location.reload()
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal centered show={show} onHide={handleClose} data-bs-theme='dark'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Change profile picture
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={updateUser} className="pt-4 d-flex flex-column align-items-center gap-4">
                    <Form.Control 
                        type="file"
                        name="avatar"
                        isInvalid={error}
                        onChange={handleFileChange}
                    />
                    {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                    <button 
                        type="submit"
                        disabled={!file}
                        className="form-button"
                    >
                        {isLoading ? (
                            <Spinner animation="border" role="status" variant="primary" size="sm"/>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}