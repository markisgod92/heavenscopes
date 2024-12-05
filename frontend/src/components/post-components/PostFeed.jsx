import { useEffect, useState } from "react"
import { SinglePost } from "./SinglePost"
import { Col, Row } from "react-bootstrap"
import { CreateNewPost } from "./CreateNewPost"
import InfiniteScroll from 'react-infinite-scroll-component'

export const PostFeed = ({ type, id }) => {
    const [posts, setPosts] = useState([])
    const [mostRecentImages, setMostRecentImages] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const getPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/${type}${id ? `/${id}` : ''}?page=${page}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            console.log(data)

            setPosts((prev) => {
                const newPosts = data.posts.filter((post) => !prev.some((p) => p._id === post._id));
                return [...newPosts, ...prev];
              });
              
            setHasMore(data.hasMore)
            if(page === 1) getRecentImages(data.posts)
        } catch (error) {
            console.error(error)
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

            <Col sm={12} className="p-0 pb-5">
                <CreateNewPost bodyId={type === 'by-body' ? id : null} refresh={getPosts} />
            </Col>

            <Col sm={12} className="p-0 d-flex flex-column gap-3">
                {posts.length > 0 && (
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<div>Loading posts...</div>}
                        endMessage={<div>End of posts.</div>}
                    >
                        {posts.map((post, i) => (
                            <SinglePost postData={post} key={`post-${i}`} />
                        ))}
                    </InfiniteScroll>
                )}
            </Col>
        </>
    )
}