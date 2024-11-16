import { useState } from "react"
import { MediaModal } from "./MediaModal"

export const MediaCard = ({ item }) => {
    const [showModal, setShowModal] = useState(false)

    const handleShowModal = () => {
        setShowModal(prev => !prev)
    }

    return (
        <>
            <div
                className='h-100 w-100 d-flex justify-content-center align-items-center'
                onClick={handleShowModal}
            >
                <img src={item.mediaUrl} alt={item.title} className='official-media-slide-img' />
            </div>

            <MediaModal data={item} show={showModal} handleClose={handleShowModal} />
        </>
    )
}