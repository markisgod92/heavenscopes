const isAdmin = (req, res, next) => {
    const authorization = req.header('Authorization')

    if(authorization === 'admin') {
        next()
    } else if (!authorization || authorization !== 'admin') {
        const error = new Error('Forbidden')
        error.status = 403
        return next(error)
    }
}

module.exports = isAdmin