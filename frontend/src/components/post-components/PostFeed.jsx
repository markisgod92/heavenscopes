import { useEffect, useState } from "react"
import { SinglePost } from "./SinglePost"
import { Col, Row, Spinner } from "react-bootstrap"
import { CreateNewPost } from "./CreateNewPost"
import InfiniteScroll from 'react-infinite-scroll-component'

export const PostFeed = ({ type, id }) => {
    const [posts, setPosts] = useState([])
    const [mostRecentImages, setMostRecentImages] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)

    const getPosts = async () => {
        setFailed(false)
        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/${type}${id ? `/${id}` : ''}?page=${page}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            console.log(data)

            if(!response.ok && data.statusCode === 404) {
                setLoading(false)
                return
            }

            setPosts((prev) => {
                if (Array.isArray(prev) && data.posts) {
                    const newPosts = data.posts.filter((post) => !prev.some((p) => p._id === post._id));
                    return [...newPosts, ...prev];
                }

                return prev
            });

            setHasMore(data.hasMore)
            if (page === 1) getRecentImages(data.posts)
        } catch (error) {
            setFailed(true)
        } finally {
            setLoading(false)
        }
    }

    const getRecentImages = (data) => {
        const mostRecentFour = []

        for (let i = 0; i < data.length; i++) {
            if (mostRecentFour.length >= 4) break
            const images = data[i].media.slice(0, 4)
            mostRecentFour.push(...images)
        }

        setMostRecentImages(mostRecentFour)
    }

    useEffect(() => {
        getPosts()
    }, [id, page])

    useEffect(() => {
        setPosts([])
    }, [id])

    return (
        <>
            {mostRecentImages.length > 0 && (
                <Col sm={12} className="p-0 pb-5">
                    <Row>
                        <h5>Latest uploads</h5>
                    </Row>

                    <Row xs={2} md={4} className="g-3">
                        {mostRecentImages.map((image, i) => (
                            <Col>
                                <img src={image} alt={`most-recent-${i}`} className='w-100 h-100 ratio-1x1 object-fit-cover' />
                            </Col>
                        ))}
                    </Row>
                </Col>
            )}

            <Col sm={12} className="p-0 pb-3">
                <CreateNewPost bodyId={type === 'by-body' ? id : null} refresh={getPosts} />
            </Col>

            <Col sm={12} className="p-0 d-flex flex-column gap-3">
                {isLoading && !isFailed && (
                    <div className="p-5 text-center">
                        <Spinner 
                            animation="grow"
                            size="lg"
                            role="status"
                        />
                    </div>
                )}

                {!isLoading && isFailed && (
                    <div className="p-5 d-flex flex-column gap-3 align-items-center">
                        <span>There was an error loading posts.</span>
                        <button className="form-button" onClick={getPosts}>Try again</button>
                    </div>
                )}

                {!isLoading && !isFailed && posts && posts.length > 0 && (
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        endMessage={<div className="p-3 text-center">End of posts.</div>}
                    >
                        {posts.map((post, i) => (
                            <SinglePost postData={post} key={`post-${i}`} />
                        ))}
                    </InfiniteScroll>
                )}

                {!isLoading && !isFailed && posts && posts.length === 0 && (
                    <div className="p-5 text-center">There isn't any post yet.</div>
                )}
            </Col>
        </>
    )
}