export const convertUTCString = (string) => {
    try {
        const date = new Date(string)

        if (isNaN(date.getTime())) {
            throw new Error('Date not available.')
        }

        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short"
        }

        return date.toLocaleString('en-GB', options)
    } catch (error) {
        return 'Date reading error.'
    }
}