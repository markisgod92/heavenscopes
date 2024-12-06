import { useEffect, useRef, useState } from 'react'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import './createnewpost.css'

export const CreateNewPost = ({ bodyId, refresh }) => {
    const [celestialBodies, setCelestialBodies] = useState(null)
    const [isLoadingBodies, setLoadingBodies] = useState(false)
    const [isFaileBodies, setFailedBodies] = useState(false)
    const [isExpanded, setExpanded] = useState(false)
    const [inputData, setInputData] = useState({
        reference: [bodyId && bodyId],
        textContent: '',
        isPublic: true
    })
    const [files, setFiles] = useState([])
    const fileInputRef = useRef()
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)

    const handleExpand = () => setExpanded(true)
    const handleCollapse = () => setExpanded(false)

    const handleFileChange = (e) => setFiles([...e.target.files])

    const handleVisibilityOption = (e) => {
        setInputData({
            ...inputData,
            isPublic: e.target.value === 'true'
        })
    }

    const getCelestialBodies = async () => {
        setFailedBodies(false)
        setLoadingBodies(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/all`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()
            setCelestialBodies(data)
        } catch (error) {
            setFailedBodies(true)
        } finally {
            setLoadingBodies(false)
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

        if (!validatePost()) {
            return
        }

        setLoading(true)

        let post = inputData

        if (files.length > 0) {
            const pictures = await uploadMedia(files)
            post = {
                ...post,
                media: pictures
            }
        }

        try {
                await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/new`, {
                method: 'POST',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization')),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(post)
            })

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
        <div className={`rounded-3 p-3 new-post-div border border-1 border-light ${isExpanded ? 'expanded' : ''}`}>

            <Form onSubmit={submitPost} className={`d-flex flex-column ${isExpanded ? 'gap-3' : ''}`}>
                <Form.Control
                    as='textarea'
                    placeholder='What did you observe tonight?'
                    rows={isExpanded ? 3 : 1}
                    value={inputData.textContent}
                    onChange={(e) => setInputData({
                        ...inputData,
                        textContent: e.target.value
                    })}
                    onClick={handleExpand}
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
                        {isLoadingBodies && !isFaileBodies && (
                            <div className='text-center'>
                                <Spinner 
                                    animation='grow'
                                    role='status'
                                    size='sm'
                                />
                            </div>
                        )}

                        {!isLoadingBodies && isFaileBodies && (
                            <div className='text-center'>
                                <span>Failed to load celestial bodies data.</span>
                                <button className='btn btn-link' onClick={getCelestialBodies}>Try again</button>
                            </div>
                        )}

                        {!isLoadingBodies && !isFaileBodies && celestialBodies && (
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

                <div className='d-flex justify-content-between align-items-center gap-2'>
                    <Form.Select
                        style={{ maxWidth: '130px' }}
                        value={inputData.isPublic.toString()}
                        onChange={handleVisibilityOption}
                    >
                        <option value="true">Public</option>
                        <option value="false">Followers</option>
                    </Form.Select>

                    {isFailed && (
                        <div className='text-danger'>Error. Try again.</div>
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

                <div className='p-0 text-center'>
                    <button className='menu-arrow-button' onClick={handleCollapse}>
                        <i className="bi bi-caret-up-fill"></i>
                    </button>
                </div>
            </Form>
        </div>
    )
} 