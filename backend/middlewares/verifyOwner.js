const jwt = require('jsonwebtoken')

const verifyOwner = (req, res, next) => {
    const token = req.user
    const { userId } = req.params
    
    try {
        if (token.id !== userId) {
            const error = new Error('Unhautorized')
            error.status = 401
            return next(error)
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = verifyOwner