import { useEffect, useRef, useState } from 'react'
import { useSession } from '../../custom-hooks/useSession'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import './createnewpost.css'

export const CreateNewPost = ({ bodyId, refresh }) => {
    const session = useSession()
    const [celestialBodies, setCelestialBodies] = useState(null)
    const [inputData, setInputData] = useState({
        reference: [bodyId && bodyId],
        textContent: ''
    })
    const [files, setFiles] = useState([])
    const fileInputRef = useRef()
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)

    const handleFileChange = (e) => {
        setFiles([...e.target.files])
    }

    const getCelestialBodies = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/all`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()
            setCelestialBodies(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleReferenceSelect = (id) => {
        if (inputData.reference.includes(id)) {
            setInputData({
                ...inputData,
                reference: inputData.reference.filter(bodyId => bodyId !== id)
            })
        } else {
            setInputData({
                ...inputData,
                reference: [...inputData.reference, id]
            })
        }
    }

    const validatePost = () => {
        return inputData.textContent || files.length > 0
    }

    const uploadMedia = async (files) => {
        try {
            const uploads = files.map(file => {
                const pictureData = new FormData()
                pictureData.append('img', file)

                return fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                    },
                    body: pictureData
                })
            })

            const responses = await Promise.all(uploads)
            const jsonResponses = await Promise.all(responses.map(
                res => res.json()
            ))
            const data = jsonResponses.flatMap(media => media.images)
            return data
        } catch (error) {
            throw new Error(error)
        }
    }

    const submitPost = async (e) => {
        e.preventDefault()
        setFailed(false)

        if(!validatePost()) {
            return
        }

        setLoading(true)

        let post = inputData

        if(files.length > 0) {
            const pictures = await uploadMedia(files)
            post = {
                ...post,
                media: pictures
            }
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/new`, {
                method: 'POST',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization')),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(post)
            })
            const data = await response.json()
            
            setInputData({
                reference: [bodyId && bodyId],
                textContent: ''
            })
            setFiles([])
            fileInputRef.current.value = ''

            refresh()
        } catch (error) {
            setFailed(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCelestialBodies()
    }, [])

    useEffect(() => {
        setInputData({
            ...inputData,
            reference: bodyId ? [bodyId] : []
        })
    }, [bodyId])

    return (
        <div className='rounded-3 p-3 new-post-div border border-1 border-light'>

            <Form onSubmit={submitPost} className='d-flex flex-column gap-3'>
                <Form.Control
                    as='textarea'
                    placeholder='What did you observe tonight?'
                    rows={3}
                    value={inputData.textContent}
                    onChange={(e) => setInputData({
                        ...inputData,
                        textContent: e.target.value
                    })}
                />

                <Form.Control 
                    type='file'
                    multiple
                    onChange={handleFileChange}
                    name='img'
                    ref={fileInputRef}
                />

                <Form.Group as={Row}>
                    <Form.Label column sm={1}>Tag:</Form.Label>
                    <Col sm={11}>
                    {celestialBodies && (
                        <ul className='d-flex gap-3 align-items-center flex-wrap list-unstyled'>
                            {celestialBodies.map(body => (
                                <li key={body._id}>
                                    <label className='tag-selector'>
                                        <input
                                            type='checkbox'
                                            value={body._id}
                                            checked={inputData.reference.includes(body._id)}
                                            onChange={() => handleReferenceSelect(body._id)}
                                        />
                                        {body.primaryName}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                    </Col>
                </Form.Group>

                <div className='d-flex justify-content-center justify-content-md-end align-items-center gap-3'>
                    {isFailed && (
                        <div className='text-danger'>Error sending your post. Please try again.</div>
                    )}

                    <button type='submit' disabled={isLoading} className='form-button'>
                        {isLoading ? (
                            <Spinner 
                                animation='grow'
                                size='sm'
                                role='status'
                            />
                        ) : (
                            <span>Post</span>
                        )}
                    </button>
                </div>
            </Form>

        </div>
    )
} 