const notFoundErrorHandler = (err, req, res, next) => {
    if(err.status === 404) {
        res.status(404)
            .send({ 
                statusCode: 404, 
                message: err.message
            })
    } else {
        next(err)
    }
}

module.exports = notFoundErrorHandler