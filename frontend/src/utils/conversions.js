export const convertMetersToMiles = (meters) => {
    const miles = meters / 1609.344
    return miles.toFixed(2)
}

export const unixUTCToTime = (unixString) => {
    const timestamp = Number(unixString)
    const date = new Date(timestamp * 1000)
    
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
}