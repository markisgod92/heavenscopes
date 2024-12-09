import { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { useParams, useSearchParams } from "react-router-dom"
import { MediaCard } from "../components/mediaVisualization/MediaCard"

export const Media = () => {
    const { paramId} = useParams()
    const [searchParams] = useSearchParams()
    const [media, setMedia] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const makeQueryParams = () => {
        const type = searchParams.get('type')
        if (type === 'body' && paramId) return `&bodyId=${paramId}`
        if (type === 'user' && paramId) return `&userId=${paramId}`
        return ''
    }

    const getMedia = async () => {
        try {
            const queryParams = makeQueryParams()
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/media/feed?page=${page}${queryParams}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            setMedia(data.media)
            setHasMore(data.hasMore)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getMedia()
    }, [])

    return (
        <Row className="p-3 g-5">
            {media && media.length > 0 && media.map((item, i) => (
                <Col sm={12} key={`media-${i}`}>
                   <MediaCard item={item} />
                </Col>
            ))}
        </Row>
    )
}