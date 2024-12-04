import { Avatar } from '@mui/material'
import { Button, Form, Spinner } from 'react-bootstrap'
import './singlepost.css'
import { Link } from 'react-router-dom'
import { convertUTCString } from '../../utils/date-conversion'
import { useSession } from '../../custom-hooks/useSession'
import { useEffect, useState } from 'react'
import { PostComments } from './PostComments'

export const SinglePost = ({ postData }) => {
    const { _id, userId, reference, textContent, media, likes, comments, createdAt } = postData
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
        <div className="single-post rounded-3 p-3 d-flex flex-column gap-3">
            <div className='d-flex gap-3'>
                <Avatar
                    src={userId.profilePic}
                    alt={userId.username}
                    sx={{ width: 56, height: 56 }}
                />

                <div className="flex-grow-1 d-flex flex-column gap-2">
                    <div className='d-flex justify-content-between flex-wrap'>
                        <div className='d-flex gap-2'>
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

                        <div className='fst-italic'>{convertUTCString(createdAt)}</div>
                    </div>

                    <div>{textContent}</div>
                </div>
            </div>

            <div className='d-flex justify-content-between'>
                <Button onClick={likePost} className='like-btn'>
                    {isLiked ? (
                        <i className="bi bi-heart-fill"></i>
                    ) : (
                        <i className="bi bi-heart"></i>
                    )}
                </Button>

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
                        <Button type='submit' className='add-comment-btn' disabled={isSendingComment}>
                            {isSendingComment ? (
                                <Spinner
                                    role='status'
                                    animation='grow'
                                    size='sm'
                                />
                            ) : (
                                <i className="bi bi-send"></i>
                            )}
                        </Button>
                    </Form>
                )}
            </div>
        </div>
    )
}