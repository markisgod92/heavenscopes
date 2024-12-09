import { Avatar } from "@mui/material"
import { Link } from "react-router-dom"
import { convertUTCString } from "../../utils/date-conversion"

export const MediaCard = ({ item }) => {
    return (
        <div className="d-flex flex-column gap-2">
            <img src={item.contentUrl} alt={`${item.postRef._id}`} className="w-100 h-100 ratio-1x1 object-fit-cover border border-1 border-light p-0" />

            <div className="d-flex gap-3">
                <Avatar
                    src={item.userId.profilePic}
                    alt={item.userId.username}
                    sx={{ width: 56, height: 56 }}
                />

                <div className='flex-grow-1 d-flex flex-column flex-md-row gap-1 justify-content-between flex-wrap align-items-md-center'>
                    <div className='d-flex flex-column flex-md-row gap-md-2'>
                        <Link to={`/profile/${item.userId._id}`}>
                            {item.userId.username}
                        </Link>

                        {item.reference.length !== 0 && (
                            <div className='d-flex gap-1'>
                                <span>observing: </span>
                                {item.reference.map((body, i) => (
                                    <>
                                        <span key={`${item._id}-ref-${i}`}>
                                            <Link to={`/feed/${body.primaryName}`}>
                                                {body.primaryName}
                                            </Link>
                                        </span>
                                        {i < item.reference.length - 1 && <span>, </span>}
                                    </>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='d-flex gap-3 post-info'>
                        <div>{item.isPublic ? (<i className="bi bi-globe2"></i>) : (<i className="bi bi-people-fill"></i>)}</div>
                        <div className='fst-italic'>{convertUTCString(item.createdAt)}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}