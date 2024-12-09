import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

export const LatestUploads = ({ type, id }) => {
    const [media, setMedia] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)

    const makeQueryParams = () => {
        if(type && id) return `&${type}=${id}`
        return ''
    }

    const getMedia = async () => {
        try {
            const queryParams = makeQueryParams()
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/media/feed?limit=4${queryParams}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            setMedia(data.media)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getMedia()
    }, [])

    return (
        <Row xs={2} md={4}>
            {media && media.length > 0 && media.map((item, i) => (
                <Col key={`latest-${i}`} className="border border-1 border-light p-0">
                    <img src={item.contentUrl} alt={`latest-${i}`} className="w-100 h-100 ratio-1x1 object-fit-cover" />
                </Col>
            ))}
        </Row>
    )
}