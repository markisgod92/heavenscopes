const UserModel = require('../models/UserModel')

const getFollowers = async (req, res, next) => {
    const token = req.user

    try {
        console.log('getting followers')
        const user = await UserModel.findById(token.id)
            .select('following')

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            return next(error)
        }
        console.log(user._id)

        const followingList = user.following
        console.log(followingList.length)

        req.followingList = followingList
        
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = getFollowers