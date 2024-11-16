import { useEffect } from "react"
import { Modal } from "react-bootstrap"

export const MediaModal = ({ data, show, handleClose }) => {
    const { title, mediaUrl, description, creditInfo } = data

    useEffect(() => {
    }, [show])

    return (
        <Modal show={show} onHide={handleClose} fullscreen>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className="d-flex justify-content-center align-items-center">
                <img src={mediaUrl} alt={title} className="h-100 w-100 object-fit-contain"/>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex flex-column gap-3">
                    <div>{title}</div>
                    <div>{description}</div>
                    <div>Credits: {creditInfo}</div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}