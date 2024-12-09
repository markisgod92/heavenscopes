const express = require('express')
const UserMediaModel = require('../models/UserMediaModel')
const UserModel = require('../models/UserModel')
const verifyToken = require('../middlewares/verifyToken')
const getFollows = require('../middlewares/getFollows')
require('dotenv').config()
const userMedia = express.Router()

userMedia.get('/feed', verifyToken, getFollows, async (req, res, next) => {
    const token = req.user
    const following = req.followingList
    const {page = 1, limit = 10, bodyId, userId} = req.query

    try {
        let filters = {
            $or: [
                { isPublic: true },
                { userId: { $in: following } }
            ]
        }

        if (userId) {
            filters.$or.push({ userId: userId })
        } else {
            filters.$or.push({ userId: token.id })
        }

        if (bodyId) {
            filters.reference = bodyId
        }

        const media = await UserMediaModel.find(filters)
            .sort({ createdAt: -1 })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'postRef', select: '_id, textContent' }
            ])
            .limit(limit)
            .skip((page - 1) * limit)

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
        const hasMore = (page - 1) * limit + media.length < totalMedia

        res.status(200)
            .json({
                media: media,
                totalMedia: totalMedia,
                hasMore: hasMore
            })
    } catch (error) {
        next(error)
    }
})

module.exports = userMedia