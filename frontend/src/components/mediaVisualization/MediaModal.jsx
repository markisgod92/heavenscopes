import { useEffect, useState } from "react"
import { Carousel, Modal } from "react-bootstrap"
import './media.css'

export const MediaModal = ({ show, onHide, media, index }) => {
    const [activeIndex, setActiveIndex] = useState(index)

    const handleSelect = (selectedIndex) => setActiveIndex(selectedIndex)
    
    useEffect(() => {
        setActiveIndex(index)
    }, [index])

    return (
        <Modal show={show} onHide={onHide} centered data-bs-theme='dark'>
            <Modal.Header closeButton></Modal.Header>

            <Modal.Body className="w-100 h-100 d-flex justify-content-center align-items-center ">

                {media && media.length > 1 && (
                    <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null} className="w-100 h-100">
                        {media.map(item => (
                            <Carousel.Item className="w-100 h-100">
                                <img src={item.contentUrl} alt={`${item.postRef._id}-media`} className="w-100 h-100 object-fit-cover"/>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}

                {media && media.length === 1 && (
                    <img src={media[0].contentUrl} alt={`${media[0].postRef._id}-media`} className="w-100 h-100 object-fit-cover"/>
                )}

                {!media && (
                    <div className="h-100 d-flex justify-content-center align-items-center">
                        Error loading media
                    </div>
                )}

            </Modal.Body>
        </Modal>
    )
}