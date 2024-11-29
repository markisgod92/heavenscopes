import { Avatar } from '@mui/material'
import './singlepost.css'
import { Link } from 'react-router-dom'
import { convertUTCString } from '../../utils/date-conversion'

export const SinglePost = ({ postData }) => {
    const { userId, reference, textContent, media, likes, comments, createdAt } = postData

    return (
        <div className="single-post d-flex gap-3">
            <Avatar
                src={userId.profilePic}
                alt={userId.username}
                sx={{ width: 56, height: 56 }}
            />

            <div className="d-flex flex-column gap-2">
                <Link to={`/profile/${userId._id}`}>
                    {userId.username}
                </Link>
                {reference.length !== 0 && (
                    <div className='d-flex gap-3'>
                        <span>observing: </span>
                        <ul className='list-unstyled d-flex gap-2'>
                            {reference.map(body => (
                                <li>
                                    <Link to={`/feed/${body.primaryName}`}>
                                        {body.primaryName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div>{textContent}</div>
                <div>{convertUTCString(createdAt)}</div>
            </div>
        </div>
    )
}