const jwt = require('jsonwebtoken')

const verifyOwner = (req, res, next) => {
    const token = req.header('Authorization')
    const {userId} = req.params

    try {
        const userToken = jwt.decode(token)

        if(userToken.id !== userId) {
            const error = new Error('Unhautorized')
            error.status(401)
            return next(error)
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = verifyOwner