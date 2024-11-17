const coordDecimalToDMS = (decimal) => {
    const isNegative = decimal < 0
    const degrees = Math.floor(decimal)
    const minutesDecimal = (decimal - degrees) * 60
    const minutes = Math.floor(minutesDecimal)
    const seconds = Math.round((minutesDecimal - minutes) * 60)

    return {
        isNegative: isNegative,
        degrees: degrees,
        minutes: minutes,
        seconds: seconds
    }
}

export const coordDecimalToString = (decimal, isLat) => {
    const {isNegative, degrees, minutes, seconds} = coordDecimalToDMS(decimal)
    let direction = ''

    if(isLat && !isNegative) {
        direction = 'N'
    } else if (isLat && isNegative) {
        direction = 'S'
    } else if (!isLat && !isNegative) {
        direction = 'E'
    } else {
        direction = 'W'
    }

    return `${degrees}° ${String(minutes).padStart(2, '0')}' ${String(seconds).padStart(2, '0')}" ${decimal !== 0 ? direction : ''}`
}

export const mtToFt = (m) => {
    return m * 3.28084
}

export const ftToMt = (ft) => {
    return ft * 0.3048
}