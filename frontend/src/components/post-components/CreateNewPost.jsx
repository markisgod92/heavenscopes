import { useEffect, useState } from 'react'
import { useSession } from '../../custom-hooks/useSession'
import { Button, Col, Form, Row } from 'react-bootstrap'
import './createnewpost.css'

export const CreateNewPost = ({ bodyId }) => {
    const session = useSession()
    const [celestialBodies, setCelestialBodies] = useState(null)
    const [inputData, setInputData] = useState({
        reference: [bodyId && bodyId],
        textContent: ''
    })

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

    const submitPost = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/new`, {
                method: 'POST',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization')),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(inputData)
            })
            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.error(error)
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

                <div className='d-flex justify-content-center justify-content-md-end'>
                    <Button type='submit'>Post</Button>
                </div>
            </Form>

        </div>
    )
} 