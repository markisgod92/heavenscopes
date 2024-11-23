export class CustomError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
    }

    toObject() {
        return {
            message: this.message,
            statusCode: this.statusCode
        }
    }
}