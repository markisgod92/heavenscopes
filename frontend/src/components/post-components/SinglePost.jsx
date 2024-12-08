import { Avatar } from '@mui/material'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import './singlepost.css'
import { Link } from 'react-router-dom'
import { convertUTCString } from '../../utils/date-conversion'
import { useSession } from '../../custom-hooks/useSession'
import { useState } from 'react'
import { PostComments } from './PostComments'

export const SinglePost = ({ postData }) => {
    const { _id, userId, reference, textContent, media, likes, comments, createdAt, isPublic } = postData
    const session = useSession()
    const [isLiked, setLiked] = useState(likes.includes(session.id))
    const [commentsList, setCommentsList] = useState(comments)
    const [commentInput, setCommentInput] = useState('')
    const [isSendingComment, setSendingComment] = useState(false)
    const [isSendFailed, setSendFailed] = useState(false)
    const [isShowingComments, setShowingComments] = useState(false)

    const handleCommentInput = (e) => {
        setCommentInput(e.target.value)
    }

    const toggleShowComments = () => {
        if (commentsList.length > 0) {
            setShowingComments(prev => !prev)
        }
    }

    const likePost = async () => {
        const token = JSON.parse(localStorage.getItem('Authorization'))

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/like/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json()

            if (data.message === 'liked') {
                setLiked(true)
            } else {
                setLiked(false)
            }
        } catch (error) {
            return
        }
    }

    const addComment = async (e) => {
        e.preventDefault()

        if (!commentInput) {
            return
        }

        setSendingComment(true)
        const token = JSON.parse(localStorage.getItem('Authorization'))

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/comment/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ comment: commentInput })
            })
            const data = await response.json()
            setCommentsList(data)
        } catch (error) {
            setSendFailed(true)
        } finally {
            setSendingComment(false)
            setCommentInput('')
        }
    }


    return (
        <div className="single-post rounded-3 p-3 d-flex flex-column gap-3 my-3">
            <div className='d-flex gap-3'>
                <Avatar
                    src={userId.profilePic}
                    alt={userId.username}
                    sx={{ width: 56, height: 56 }}
                />


                <div className='flex-grow-1 d-flex flex-column flex-md-row gap-1 justify-content-between flex-wrap align-items-md-center'>
                    <div className='d-flex flex-column flex-md-row gap-md-2'>
                        <Link to={`/profile/${userId._id}`}>
                            {userId.username}
                        </Link>
                        {reference.length !== 0 && (
                            <div className='d-flex gap-1'>
                                <span>observing: </span>
                                {reference.map((body, i) => (
                                    <>
                                        <span key={`${_id}-ref-${i}`}>
                                            <Link to={`/feed/${body.primaryName}`}>
                                                {body.primaryName}
                                            </Link>
                                        </span>
                                        {i < reference.length - 1 && <span>, </span>}
                                    </>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='d-flex align-items-center gap-3 post-info'>
                        <div>{isPublic ? (<i className="bi bi-globe2"></i>) : (<i className="bi bi-people-fill"></i>)}</div>
                        <div className='fst-italic'>{convertUTCString(createdAt)}</div>
                    </div>
                </div>
            </div>

            <div>{textContent}</div>

            {media && (
                <Row xs={2} md={3} className='g-3'>
                    {media.map((item, i) => (
                        <Col key={`${_id}-media-${i}`}>
                            <img
                                src={item}
                                alt={`${_id}-image-${i}`}
                                className='w-100 h-100 ratio-1x1 object-fit-cover'
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <div className='d-flex justify-content-between'>
                <button onClick={likePost} className='form-button'>
                    {isLiked ? (
                        <i className="bi bi-heart-fill"></i>
                    ) : (
                        <i className="bi bi-heart"></i>
                    )}
                </button>

                <Button className='btn-link' onClick={toggleShowComments}>
                    {isShowingComments ? (
                        <span>Hide comments</span>
                    ) : (
                        commentsList.length > 0 ? (
                            <span>Show comments ({commentsList.length})</span>
                        ) : (
                            <span>No comments</span>
                        )
                    )}
                </Button>
            </div>

            {isShowingComments && <PostComments comments={commentsList} />}

            <div>
                {isSendFailed ? (
                    <div className='d-flex gap-3 align-items-center'>
                        <span className='text-danger'>Error sending comment.</span>
                        <Button className='btn-link' onClick={() => setSendFailed(false)}>Try again</Button>
                    </div>
                ) : (
                    <Form className='d-flex gap-3' onSubmit={addComment}>
                        <Form.Control
                            type='text'
                            placeholder='Leave a comment'
                            value={commentInput}
                            onChange={handleCommentInput}
                        />
                        <button type='submit' className='form-button' disabled={isSendingComment}>
                            {isSendingComment ? (
                                <Spinner
                                    role='status'
                                    animation='grow'
                                    size='sm'
                                />
                            ) : (
                                <i className="bi bi-send"></i>
                            )}
                        </button>
                    </Form>
                )}
            </div>
        </div>
    )
}