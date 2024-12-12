import { useEffect, useState } from "react"
import { Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { MediaModal } from "./MediaModal"

export const LatestUploads = ({ type, id, mode }) => {
    const [media, setMedia] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)
    const [isMediaModalOpen, setMediaModalOpen] = useState(false)
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)

    const makeQueryParams = () => {
        if (type && id) return `&${type}=${id}`
        return ''
    }

    const openMediaModal = (i) => {
        setSelectedMediaIndex(i)
        setMediaModalOpen(true)
    }

    const closeMediaModal = () => setMediaModalOpen(false)

    const getMedia = async () => {
        setFailed(false)
        setLoading(true)

        try {
            const queryParams = makeQueryParams()
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/media/feed?limit=${mode === 'home' ? '6' : '4'}${queryParams}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            setMedia(data.media)
        } catch (error) {
            setFailed(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMedia()
    }, [type, id])

    return (
        <Row xs={2} md={mode === 'home' ? '' : 4}>
            {isLoading && !isFailed && (
                <div className="p-3 d-flex justify-content-center">
                    <Spinner
                        animation="grow"
                        size="lg"
                        role="status"
                    />
                </div>
            )}

            {!isLoading && isFailed && (
                <div className="p-3 d-flex flex-column justify-content-center align-items-center gap-2">
                    <span>Error loading media.</span>
                    <button className="form-button" onClick={getMedia}>Try again</button>
                </div>
            )}

            {!isLoading && !isFailed && media && media.length > 0 && media.map((item, i) => (
                <Col key={`latest-${i}`} className="border border-1 border-light p-0">
                    <img
                        src={item.contentUrl}
                        alt={`latest-${i}`}
                        className="w-100 h-100 ratio-1x1 object-fit-cover post-image"
                        onClick={() => openMediaModal(i)}
                    />

                    <MediaModal show={isMediaModalOpen} onHide={closeMediaModal} media={media} index={selectedMediaIndex} />
                </Col>
            ))}

            {!isLoading && !isFailed && !media && (
                <div className="p-3 w-100 text-center">There isn't any media yet.</div>
            )}
        </Row>
    )
}