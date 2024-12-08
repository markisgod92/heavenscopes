import { useEffect, useState } from "react"
import { SinglePost } from "./SinglePost"
import { Col, Row, Spinner } from "react-bootstrap"
import { CreateNewPost } from "./CreateNewPost"
import InfiniteScroll from 'react-infinite-scroll-component'
import { ScrollableFeed } from "./ScrollableFeed"

export const PostFeed = ({ type, id }) => {
    const [mostRecentImages, setMostRecentImages] = useState([])

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
                <CreateNewPost bodyId={type === 'by-body' ? id : null} refresh={(newPost) => getPosts(newPost)} />
            </Col>

            <Col sm={12} className="p-0 d-flex flex-column gap-3">
                <ScrollableFeed type={type} id={id} />
            </Col>
        </>
    )
}