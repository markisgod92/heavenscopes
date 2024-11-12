const genericErrorHandler = (err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Internal server error.'

    res.status(errorStatus)
        .send({
            statusCode: errorStatus,
            message: errorMessage,
            stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined
        })
}

module.exports = genericErrorHandler