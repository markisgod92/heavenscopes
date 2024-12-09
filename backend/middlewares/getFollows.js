const UserModel = require('../models/UserModel')

const getFollows = async (req, res, next) => {
    const token = req.user

    try {
        const user = await UserModel.findById(token.id)
            .select('following')

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            return next(error)
        }

        const followingList = user.following
        req.followingList = followingList

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = getFollows