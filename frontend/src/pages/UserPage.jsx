import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSession } from "../custom-hooks/useSession"
import { Row, Col, Button } from "react-bootstrap"
import { Avatar, CircularProgress, IconButton } from "@mui/material"
import { ModifyAvatarModal } from "../components/user-management/ModifyAvatarModal"
import { BioForm } from "../components/user-management/BioForm"
import { PostFeed } from '../components/post-components/PostFeed'

export const UserPage = () => {
    const [userData, setUserData] = useState(null)
    const { userId } = useParams()
    const session = useSession()
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const navigate = useNavigate()

    const getUserData = async (isCurrentUser) => {
        setLoading(true)

        const auth = JSON.parse(localStorage.getItem('Authorization'))
        const endpoint = isCurrentUser
            ? `${import.meta.env.VITE_BACKEND_BASE_URL}/user/me/${userId}`
            : `${import.meta.env.VITE_BACKEND_BASE_URL}/user/${userId}`

        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': auth
                }
            })

            const data = await response.json()

            if (!response.ok) {
                const fetchError = new Error(data.message || 'Failed to fetch user data.')
                throw fetchError
            }

            setUserData(data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleShowAvatarModal = () => {
        setShowAvatarModal(prev => !prev)
    }

    const logout = () => {
        localStorage.removeItem('Authorization')
        navigate('/')
    }

    useEffect(() => {
        const isCurrentUser = userId === session.id
        getUserData(isCurrentUser)
    }, [userId])

    return (
        <>
            <Row className="pt-2">
                <div className="text-end">
                    <button className="form-button" onClick={logout}>
                        <i className="bi bi-box-arrow-left"></i>
                        <span className="ps-2">Logout</span>
                    </button>
                </div>
            </Row>

            <Row className="pt-1">
                {isLoading && !error && (
                    <div className="h-100 d-flex flex-column gap-3 align-items-center align-items-center">
                        <CircularProgress />
                        <span>Loading user data...</span>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="h-100 d-flex flex-column gap-1 align-items-center align-items-center">
                        {error}
                        <IconButton onClick={forceReload}>
                            <i className="bi bi-arrow-clockwise text-white"></i>
                        </IconButton>
                        <span>Try again</span>
                    </div>
                )}

                {!isLoading && !error && userData && (
                    <>
                        <Col xs={12} md={6} lg={3}>
                            <div className="position-relative p-3 d-flex justify-content-center justify-content-md-start">
                                <Avatar
                                    src={userData.profilePic}
                                    alt={userData.username}
                                    sx={{ width: 200, height: 200 }}
                                />
                                <Button
                                    variant="outline-secondary"
                                    className="modify-avatar-button rounded-circle"
                                    onClick={handleShowAvatarModal}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Button>

                                <ModifyAvatarModal userId={userId} show={showAvatarModal} handleClose={handleShowAvatarModal} />
                            </div>
                        </Col>

                        <Col xs={12} md={6} lg={9}>
                            <div className="h-100 py-4 d-flex flex-column justify-content-between gap-5 gap-md-0 border-bottom border-1">
                                <div className="d-flex flex-column gap-2">
                                    <h3>{userData.username}</h3>
                                    <div>{userData.followers.length} followers</div>
                                    <div>{userData.following.length} following</div>
                                </div>

                                <div>
                                    <BioForm userId={userId} isCurrentUser={userId === session.id} bio={userData.bio || ''} />
                                </div>
                            </div>
                        </Col>
                    </>
                )}
            </Row>

            <Row className="p-3">
                <PostFeed type={'by-user'} id={userId} />
            </Row>
        </>
    )
}