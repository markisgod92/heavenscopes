import { Avatar } from '@mui/material'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import './singlepost.css'
import { Link } from 'react-router-dom'
import { convertUTCString } from '../../utils/date-conversion'
import { useSession } from '../../custom-hooks/useSession'
import { useState } from 'react'
import { PostComments } from './PostComments'
import { MediaModal } from '../mediaVisualization/MediaModal'
import { PostDeleteButton } from './PostDeleteButton'

export const SinglePost = ({ postData }) => {
    const { _id, userId, reference, textContent, media, likes, comments, createdAt, isPublic } = postData
    const session = useSession()
    const [isLiked, setLiked] = useState(likes.includes(session.id))
    const [commentsList, setCommentsList] = useState(comments)
    const [commentInput, setCommentInput] = useState('')
    const [isSendingComment, setSendingComment] = useState(false)
    const [isSendFailed, setSendFailed] = useState(false)
    const [isShowingComments, setShowingComments] = useState(false)
    const [isMediaModalOpen, setMediaModalOpen] = useState(false)
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
    const [isDeleted, setDeleted] = useState(false)
    const [isDeleting, setDeleting] = useState(false)

    const handleCommentInput = (e) => {
        setCommentInput(e.target.value)
    }

    const toggleShowComments = () => {
        if (commentsList.length > 0) {
            setShowingComments(prev => !prev)
        }
    }

    const openMediaModal = (i) => {
        setSelectedMediaIndex(i)
        setMediaModalOpen(true)
    }

    const closeMediaModal = () => setMediaModalOpen(false)

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

    const deletePost = async () => {
        setDeleting(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })

            if (response.ok) {
                setDeleted(true)
            }
        } catch (error) {
            console.error(error)
            return
        } finally {
            setDeleting(false)
        }
    }


    return (
        <div className="single-post rounded-3 p-3 d-flex flex-column gap-3 my-3">

            {!isDeleted && (
                <>
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
                                            <div key={`${_id}-ref-${i}`}>
                                                <span>
                                                    <Link to={`/feed/${body.primaryName}`}>
                                                        {body.primaryName}
                                                    </Link>
                                                </span>
                                                {i < reference.length - 1 && <span>, </span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className='d-flex align-items-center gap-3 post-info'>
                                <div>{isPublic ? (<i className="bi bi-globe2"></i>) : (<i className="bi bi-people-fill"></i>)}</div>
                                <div className='fst-italic'>{convertUTCString(createdAt)}</div>
                            </div>
                        </div>

                        {session.id === userId._id && (
                            <PostDeleteButton onDelete={deletePost} isDeleting={isDeleting}/>
                        )}
                    </div>

                    <div>{textContent}</div>

                    {media && media.length > 0 && (
                        <Row xs={2} md={3} className='g-3'>
                            {media.map((item, i) => (
                                <Col key={`${_id}-media-${i}`}>
                                    <img
                                        src={item.contentUrl}
                                        alt={`${_id}-image-${i}`}
                                        className='w-100 h-100 ratio-1x1 object-fit-cover post-image'
                                        onClick={() => openMediaModal(i)}
                                    />
                                </Col>
                            ))}

                            <MediaModal show={isMediaModalOpen} onHide={closeMediaModal} media={media} index={selectedMediaIndex} />
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

                        <button className='custom-link-button' onClick={toggleShowComments}>
                            {isShowingComments ? (
                                <span>Hide comments</span>
                            ) : (
                                commentsList.length > 0 ? (
                                    <span>Show comments ({commentsList.length})</span>
                                ) : (
                                    <span>No comments</span>
                                )
                            )}
                        </button>
                    </div>

                    {isShowingComments && <PostComments comments={commentsList} />}

                    <div>
                        {isSendFailed ? (
                            <div className='d-flex gap-3 align-items-center'>
                                <span className='text-danger'>Error sending comment.</span>
                                <button className='form-button' onClick={() => setSendFailed(false)}>Try again</button>
                            </div>
                        ) : (
                            <Form className='d-flex gap-3' onSubmit={addComment}>
                                <Form.Control
                                    type='text'
                                    placeholder='Leave a comment'
                                    value={commentInput}
                                    onChange={handleCommentInput}
                                />
                                <button type='submit' className='form-button' disabled={!commentInput || isSendingComment}>
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
                </>
            )}

            {isDeleted && (
                <div className='text-center'>Post deleted.</div>
            )}
        </div>
    )
}