const express = require('express')
const UserMediaModel = require('../models/UserMediaModel')
const UserModel = require('../models/UserModel')
const verifyToken = require('../middlewares/verifyToken')
const getFollowers = require('../middlewares/getFollowers')
require('dotenv').config()
const userMedia = express.Router()

userMedia.get('/feed', verifyToken, getFollowers, async (req, res, next) => {
    const token = req.user
    const following = req.followingList
    const {page} = req.query || 1

    try {
        const media = await UserMediaModel.find({
            $or: [
                { isPublic: true },
                { userId: { $in: following } },
                { userId: token.id }
            ]
        })
            .sort({ createdAt: -1 })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'postRef', select: '_id, textContent' }
            ])
            .limit(10)
            .skip((page - 1) * 10)

        if(media.length === 0) {
            const error = new Error('Media not found')
            error.status = 404
            return next(error)
        }

        const totalMedia = await UserMediaModel.countDocuments({
            $or: [
                { isPublic: true },
                { userId: { $in: following } },
                { userId: token.id }
            ]
        })
        const hasMore = (page - 1) * 10 + media.length < totalMedia

        res.status(200)
            .json({
                media: media,
                totalMedia: totalMedia,
                hasMore: hasMore
            })
    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = userMedia