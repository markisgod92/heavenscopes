import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"

export const LatestUploads = () => {
    const [media, setMedia] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)

    const getMedia = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/media/feed?page=1`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()
            console.log(data)

            setMedia(data.media)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getMedia()
    }, [])

    return (
        <Row xs={2} md={3} className='g-3'>
            {media && media.length > 0 && media.map((item, i) => (
                <Col key={`latest-${i}`}>
                    <img src={item.contentUrl} alt={`latest-${i}`} className="w-100 h-100 ratio-1x1 object-fit-cover"/>
                </Col>
            ))}
        </Row>
    )
}