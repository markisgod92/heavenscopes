import { Form, Modal } from "react-bootstrap"
import { SettingsForm } from "../user-management/SettingsForm"
import { useState } from "react"
import { useSession } from "../../custom-hooks/useSession"

export const SettingsModal = ({show, onHide}) => {
    const session = useSession()
    const [updatedSettings, setUpdatedSettings] = useState({})

    const handleSettingsUpdate = (newSettings) => {
        setUpdatedSettings(newSettings)
    }

    const updateUserSettings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/${session.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization')),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({settings: updatedSettings})
            })
            const token = await response.headers.get('Authorization')
            localStorage.setItem('Authorization', JSON.stringify(token))
            onHide()
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal centered show={show} onHide={onHide} data-bs-theme='dark' size="lg">
            <Modal.Body>
                <Form className="d-flex flex-column gap-2">
                    <SettingsForm onUpdate={handleSettingsUpdate}/>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <button onClick={onHide} className="form-button">Close</button>
                <button onClick={updateUserSettings} className="form-button">Save</button>
            </Modal.Footer>
        </Modal>
    )
}