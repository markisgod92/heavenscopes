import { useEffect, useState } from "react"
import { Carousel, Modal } from "react-bootstrap"
import './media.css'

export const MediaModal = ({ show, onHide, media, index }) => {
    const [activeIndex, setActiveIndex] = useState(index)
    const [isFullscreen, setFullscreen] = useState(false)

    const handleSelect = (selectedIndex) => setActiveIndex(selectedIndex)

    const toggleFullscreen = () => setFullscreen(prev => !prev)

    useEffect(() => {
        setActiveIndex(index)
    }, [index])

    return (
        <Modal show={show} onHide={onHide} centered fullscreen={isFullscreen} size='lg' data-bs-theme='dark'>
            <Modal.Header>
                <div className="w-100 d-flex justify-content-between align-items-center">
                    <button onClick={toggleFullscreen} className="menu-arrow-button">
                        <i className="bi bi-arrows-fullscreen"></i>
                    </button>

                    <button onClick={onHide} className="menu-arrow-button">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </Modal.Header>

            <Modal.Body className="w-100 h-100 d-flex justify-content-center align-items-center ">

                {media && media.length > 1 && (
                    <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null} className="w-100 h-100">

                        {media.map((item, i) => (
                            <Carousel.Item className="w-100 h-100" key={`image-${i}`}>
                                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                    <img src={item.contentUrl} alt={`${item.postRef._id}-media`} className="modal-image" />
                                </div>
                            </Carousel.Item>
                        ))}
                        
                    </Carousel>
                )}

                {media && media.length === 1 && (
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <img src={media[0].contentUrl} alt={`${media[0].postRef._id}-media`} className="modal-image" />
                    </div>
                )}

                {!media && (
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        Error loading media
                    </div>
                )}

            </Modal.Body>
        </Modal>
    )
}