import { useEffect, useState } from "react"
import { SinglePost } from "./SinglePost"
import { Spinner } from "react-bootstrap"

export const ScrollableFeed = ({ type, id, newPost }) => {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setLoading] = useState(false)
    const [isFailed, setFailed] = useState(false)

    const getPosts = async () => {
        if (isLoading || !hasMore && page > 1) return

        setFailed(false)
        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/${type}${id ? `/${id}` : ''}?page=${page}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            const data = await response.json()

            if (!response.ok && data.statusCode === 404) {
                setHasMore(false)
                setLoading(false)
                return
            }

            setPosts((prev) => {
                if (Array.isArray(prev) && data.posts) {
                    const newPosts = data.posts.filter((post) => !prev.some((p) => p._id === post._id));
                    return [...prev, ...newPosts];
                }

                return prev
            });

            setHasMore(data.hasMore)
        } catch (error) {
            setFailed(true)
        } finally {
            setLoading(false)
        }
    }

    const tryAgain = () => {
        setPage(1)
        setHasMore(true)
        getPosts()
    }

    const handlePageIncrement = () => {
        setPage(prev => prev + 1)
    }

    const handleScroll = () => {
        if (document.body.scrollHeight - 50 < window.scrollY + window.innerHeight && hasMore) {
            handlePageIncrement()
        }
    }

    const debounce = (cb, delay) => {
        let timeoutId
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            if (hasMore) {
                timeoutId = setTimeout(() => {
                    cb(...args)
                }, delay)
            }
        }
    }

    useEffect(() => {
        if(newPost) {
            setPosts(prev => [newPost, ...prev])
        }
    }, [newPost])

    useEffect(() => {
        setPosts([])
        setPage(1)
        setHasMore(true)
    }, [id])

    useEffect(() => {
        getPosts()
    }, [id, page])


    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 100)
        window.addEventListener('scroll', debouncedHandleScroll)

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll)
        }
    }, [hasMore])

    return (
        <div>
            {posts && posts.length > 0 && posts.map(post => (
                <SinglePost postData={post} key={post._id} />
            ))}

            {!isFailed && posts && posts.length === 0 && (
                <div className="p-3 text-center">There isn't any post yet.</div>
            )}

            {isLoading && !isFailed && (
                <div className="p-3 text-center">
                    <Spinner animation="grow" role="status" size="lg"/>
                </div>
            )}

            {!isLoading && isFailed && (
                <div className="p-3 d-flex flex-column align-items-center gap-2">
                    <span>Error loading posts.</span>
                    <button className="form-button" onClick={tryAgain}>Try again</button>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="p-3 text-center">No more posts.</div>
            )}
        </div>
    )
}