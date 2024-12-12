import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSession } from "../custom-hooks/useSession"
import { Row, Col, Button, Badge } from "react-bootstrap"
import { Avatar, CircularProgress, IconButton } from "@mui/material"
import { ModifyAvatarModal } from "../components/user-management/ModifyAvatarModal"
import { BioForm } from "../components/user-management/BioForm"
import { PostFeed } from '../components/post-components/PostFeed'
import { LatestUploads } from "../components/mediaVisualization/LatestUploads"

export const UserPage = () => {
    const [userData, setUserData] = useState(null)
    const { userId } = useParams()
    const session = useSession()
    const [isCurrentUser, setCurrentUser] = useState(userId === session.id)
    const [isFollowed, setFollowed] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const navigate = useNavigate()

    const getUserData = async () => {
        setLoading(true)

        const endpoint = isCurrentUser
            ? `${import.meta.env.VITE_BACKEND_BASE_URL}/user/me/${userId}`
            : `${import.meta.env.VITE_BACKEND_BASE_URL}/user/${userId}`

        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })

            const data = await response.json()

            if (!response.ok) {
                const fetchError = new Error(data.message || 'Failed to fetch user data.')
                throw fetchError
            }

            setUserData(data)
            if(!isCurrentUser) setFollowed(data.followers.includes(session.id))
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const followUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/follow/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            if(!response.ok) return

            if(data.message === 'followed') {
                setFollowed(true)
            } else if (data.message === 'unfollowed') {
                setFollowed(false)
            }
        } catch (error) {
            console.error(error)
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
        setCurrentUser(userId === session.id)
    }, [userId])

    useEffect(() => {
        getUserData()
    }, [isCurrentUser])

    return (
        <>
            {isCurrentUser && (
                <Row className="pt-2">
                    <div className="text-end">
                        <button className="form-button" onClick={logout}>
                            <i className="bi bi-box-arrow-left"></i>
                            <span className="ps-2">Logout</span>
                        </button>
                    </div>
                </Row>
            )}

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

                                {isCurrentUser && (
                                    <>
                                        <Button
                                            variant="outline-secondary"
                                            className="modify-avatar-button rounded-circle"
                                            onClick={handleShowAvatarModal}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>

                                        <ModifyAvatarModal userId={userId} show={showAvatarModal} handleClose={handleShowAvatarModal} />
                                    </>
                                )}
                            </div>
                        </Col>

                        <Col xs={12} md={6} lg={9}>
                            <div className="h-100 py-4 d-flex flex-column justify-content-between gap-5 gap-md-0 border-bottom border-1">
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3>
                                            {userData.username}
                                            {userData.isAdmin && <Badge bg='danger' pill className="ms-2">Admin</Badge>}
                                        </h3>
                                        {!isCurrentUser && (
                                            <button className="form-button" onClick={followUser}>
                                                {isFollowed ? 'Unfollow' : 'Follow'}
                                            </button>
                                        )}
                                    </div>

                                    <div>{userData.followers.length} followers</div>
                                    <div>{userData.following.length} following</div>
                                </div>

                                <div>
                                    <BioForm userId={userId} isCurrentUser={isCurrentUser} bio={userData.bio || ''} />
                                </div>
                            </div>
                        </Col>
                    </>
                )}
            </Row>

            <Row className="p-3 pt-5">
                <Col sm={12}>
                    <h5>Latest uploads</h5>
                </Col>
                <Col sm={12}>
                    <LatestUploads type={'userId'} id={userId} />
                </Col>
            </Row>

            <Row className="p-3">
                <PostFeed type={'by-user'} id={userId} />
            </Row>
        </>
    )
}