const UserModel = require('../models/UserModel')
const bcrypt = require('bcrypt')

const isAdmin = async (req, res, next) => {
    const adminAuth = req.header('AdminAuth')

    if (!adminAuth) {
        const error = new Error('Forbidden: missing admin authorization.')
        error.status = 403
        return next(error)
    }

    const userId = req.user.id
    if (!userId) {
        const error = new Error('Unhautorized: missing user id.')
        error.status = 401
        return next(error)
    }

    try {
        const user = await UserModel.findById(userId)

        if (!user) {
            const error = new Error('User not found.')
            error.status = 404
            return next(error)
        }

        if (!user.isAdmin) {
            const error = new Error('Forbidden: user is not an admin.')
            error.status = 403
            return next(error)
        }

        const isValidPasskey = await bcrypt.compare(adminAuth, user.adminPasskey)
        if (!isValidPasskey) {
            const error = new Error('Forbidden: invalid admin passkey.')
            error.status = 403
            return next(error)
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = isAdmin