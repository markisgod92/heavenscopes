import { IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import { Button, Form, Spinner } from "react-bootstrap"
import {CustomError} from '../../utils/custom-error'

export const BioForm = ({ userId, isCurrentUser, bio }) => {
    const [isModifyBioOn, setModifyBioOn] = useState(false)
    const [bioInputContent, setBioInputContent] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const changeBio = async (e) => {
        e.preventDefault()

        if (bioInputContent.length > 100) {
            setError("Can't be longer than 100 characters.")
            return
        }

        if(bioInputContent === bio) {
            setModifyBioOn(false)
            return
        }

        setLoading(true)
        const token = JSON.parse(localStorage.getItem('Authorization'))

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ bio: bioInputContent })
            })
            const data = await response.json()

            if (!response.ok) {
                throw new CustomError(data.statusCode, data.message)
            }

            localStorage.setItem('Authorization', JSON.stringify(response.headers.get('Authorization')))
            setModifyBioOn(false)
            window.location.reload()
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setBioInputContent(bio)
    }, [isModifyBioOn])

    return (
        <>
            {isCurrentUser ? (
                <>
                    {isModifyBioOn ? (
                        <Form className="d-flex gap-2 align-items-start" onSubmit={changeBio}>
                            <div className="w-100 d-flex flex-column">
                                <Form.Control
                                    type='text'
                                    value={bioInputContent}
                                    isInvalid={error}
                                    onChange={(e) => {
                                        setError(null)
                                        setBioInputContent(e.target.value)
                                    }}
                                />

                                {error && (
                                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                                )}
                                <Form.Text className={bioInputContent.length > 100 ? 'text-danger' : 'text-white'}>
                                    {bioInputContent.length}/100
                                </Form.Text>
                            </div>


                            <IconButton
                                className="text-danger p-0"
                                onClick={() => {
                                    setBioInputContent(bio)
                                    setModifyBioOn(false)
                                }}
                            >
                                <i className="bi bi-x"></i>
                            </IconButton>
                            <IconButton
                                className="text-primary p-0"
                                type="submit"
                            >
                                {isLoading ? (
                                    <Spinner animation="border" role="status" variant="primary"/>
                                ) : (
                                    <i className="bi bi-floppy"></i>
                                )}
                            </IconButton>
                        </Form>
                    ) : (
                        <>
                            <i>{bio}</i>
                            <Button variant="outline-secondary" className="border-0 rounded-circle" onClick={() => setModifyBioOn(true)}>
                                <i className="bi bi-pencil-square"></i>
                            </Button>
                        </>
                    )}
                </>
            ) : (
                <i>{bio}</i>
            )}
        </>
    )
} 