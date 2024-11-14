const addTimeOffset = (now, hours) => {
    return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString()
}

export const makeTimeOffsets = () => {
    const now = new Date()
    const nowString = now.toISOString()

    return {
        now: nowString,
        plus3h: addTimeOffset(now, 3),
        plus6h: addTimeOffset(now, 6),
        plus12h: addTimeOffset(now, 12)
    }
}