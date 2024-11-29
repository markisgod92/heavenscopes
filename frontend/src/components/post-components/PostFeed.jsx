import { useEffect, useState } from "react"
import { SinglePost } from "./SinglePost"

export const PostFeed = ({ type, id }) => {
    const [posts, setPosts] = useState([])

    const getPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/post/${type}${id ? `/${id}` : ''}`, {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('Authorization'))
                }
            })
            console.log(response.url)
            const data = await response.json()
            console.log(data)
            setPosts(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getPosts()
    }, [id])

    return (
        <div className="d-flex flex-column gap-3">
            {posts && Array.isArray(posts) && posts.length !== 0 ? (
                posts.map(post => <SinglePost postData={post}/>)
            ) : <div>No posts</div>}
        </div>
    )
}