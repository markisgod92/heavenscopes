import { useEffect, useState } from "react"
import { Spinner } from "react-bootstrap"

export const PostDeleteButton = ({onDelete, isDeleting}) => {
    const [isClickedOnce, setClickedOnce] = useState(false)

    const handleClick = () => {
        if(isClickedOnce) {
            onDelete()
        } else {
            setClickedOnce(true)
        }
    }

    useEffect(() => {
        if(isClickedOnce) {
            const timer = setTimeout(() => {
                setClickedOnce(false)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [isClickedOnce])

    return (
        <>
            {isClickedOnce && !isDeleting && (
                <button className="custom-link-button" onClick={handleClick}>Confirm?</button>
            )}

            {!isClickedOnce && !isDeleting && (
                <button className="custom-link-button" onClick={handleClick}>
                     <i className="bi bi-trash3"></i>
                </button>
            )}

            {isDeleting && (
                <button disabled className="custom-link-button">
                    <Spinner role='status' animation='grow' size='sm' />
                </button>
            )}
        </>
    )
}