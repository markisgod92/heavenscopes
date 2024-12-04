import { Avatar } from "@mui/material"
import { useState } from "react"
import { Pagination } from "react-bootstrap"
import { Link } from "react-router-dom"

export const PostComments = ({ comments }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const commentsPerPage = 5

    const lastCommentIndex = currentPage * commentsPerPage
    const firstCommentIndex = lastCommentIndex - commentsPerPage
    const currentComments = comments.slice(firstCommentIndex, lastCommentIndex)

    const totalPages = Math.ceil(comments.length / commentsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className='p-3 d-flex flex-column gap-3 border border-1 border-light rounded-3'>
            {currentComments.map(comment => (
                <div className='d-flex align-items-center gap-3'>
                    <Avatar
                        src={comment.userId.profilePic}
                        alt={comment.userId.username}
                        sx={{ width: 30, height: 30 }}
                    />

                    <div className='d-flex flex-column'>
                        <Link to={`/profile/${comment.userId._id}`}>{comment.userId.username}</Link>
                        <div>{comment.comment}</div>
                    </div>
                </div>
            ))}

            {comments.length > commentsPerPage && (
                <div className="d-flex justify-content-center">
                    <Pagination size="sm">
                        {[...Array(totalPages).keys()].map(page => (
                            <Pagination.Item
                                key={page + 1}
                                active={page + 1 === currentPage}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            )}
        </div>
    )
}