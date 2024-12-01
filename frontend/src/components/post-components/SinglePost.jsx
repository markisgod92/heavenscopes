import { Avatar } from '@mui/material'
import {Button, Form} from 'react-bootstrap'
import './singlepost.css'
import { Link } from 'react-router-dom'
import { convertUTCString } from '../../utils/date-conversion'
import {useSession} from '../../custom-hooks/useSession'
import { useEffect, useState } from 'react'

export const SinglePost = ({ postData }) => {
    const { _id, userId, reference, textContent, media, likes, comments, createdAt } = postData
    const session = useSession()
    const [isLiked, setLiked] = useState(likes.includes(session.id))
    const [commentsList, setCommentsList] = useState(comments)
    const [commentInput, setCommentInput] = useState('')

    const handleCommentInput = (e) => {
        setCommentInput(e.target.value)
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

            if(data.message === 'liked') {
                setLiked(true)
            } else {
                setLiked(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const addComment = async (e) => {
        e.preventDefault()

        if(!commentInput) {
            return
        }

        const token = JSON.parse(localStorage.getItem('Authorization'))

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/comment/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({comment: commentInput})
            })
            console.log(response)
            const data = await response.json()
            console.log(data)
            setCommentsList(data)
        } catch (error) {
            console.error(error)
        } finally {
            setCommentInput('')
        }
    }


    return (
        <div className="single-post rounded-2 p-3 d-flex flex-column gap-3">
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
                    <span className='ps-2'>{likes.length}</span>
                </Button>

                <Button className='btn-link'>
                    Show comments ({commentsList.length})
                </Button>
            </div>

            <div>
                <Form className='d-flex gap-3' onSubmit={addComment}>
                    <Form.Control 
                        type='text'
                        placeholder='Leave a comment'
                        value={commentInput}
                        onChange={handleCommentInput}
                    />
                    <Button type='submit' className='add-comment-btn'>
                        <i className="bi bi-send"></i>
                    </Button>
                </Form>
            </div>
        </div>
    )
}