import { useEffect, useState } from "react"
import { SinglePost } from "./SinglePost"
import { Col, Row, Spinner } from "react-bootstrap"
import { CreateNewPost } from "./CreateNewPost"
import InfiniteScroll from 'react-infinite-scroll-component'
import { ScrollableFeed } from "./ScrollableFeed"

export const PostFeed = ({ type, id }) => {
    const [newPost, setNewPost] = useState(null)

    const handleNewPost = (post) => {
        setNewPost(post)
    }

    return (
        <>
            <Col sm={12} className="p-0 pb-3">
                <CreateNewPost bodyId={type === 'by-body' ? id : null} onCreatePost={handleNewPost} />
            </Col>

            <Col sm={12} className="p-0 d-flex flex-column gap-3">
                <ScrollableFeed type={type} id={id} newPost={newPost}/>
            </Col>
        </>
    )
}