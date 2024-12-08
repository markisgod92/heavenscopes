const express = require('express')
const UserModel = require('../models/UserModel')
const UserPostModel = require('../models/UserPostModel')
const UserMediaModel = require('../models/UserMediaModel')
const { userMediaCloud } = require('./cloudinaryConfig')
const posts = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const verifyOwner = require('../middlewares/verifyOwner')
require('dotenv').config()

posts.get('/single/:postId', verifyToken, async (req, res, next) => {
    const { postId } = req.params

    try {
        const post = await UserPostModel.findById(postId)
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])

        if (!post) {
            const error = new Error('Post not found')
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(post)
    } catch (error) {
        next(error)
    }
})

posts.get('/by-user/:userId', verifyToken, async (req, res, next) => {
    const { userId } = req.params
    const { page } = req.query || 1

    try {
        const user = await UserModel.findById(userId)
            .sort({ createdAt: -1 })

        if (!user) {
            const error = new Error('User not found')
            error.status = 400
            return next(error)
        }

        const posts = await UserPostModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])
            .limit(10)
            .skip((page - 1) * 10)

        if (posts.length === 0) {
            const error = new Error('No posts found')
            error.status = 404
            return next(error)
        }

        const totalPosts = await UserPostModel.countDocuments({ userId: userId })
        const hasMore = (page - 1) * 10 + posts.length < totalPosts

        res.status(200)
            .json({
                posts: posts,
                totalPosts: totalPosts,
                hasMore: hasMore
            })
    } catch (error) {
        next(error)
    }
})

posts.get('/by-body/:bodyId', verifyToken, async (req, res, next) => {
    const { bodyId } = req.params
    const { page } = req.query || 1

    try {
        const posts = await UserPostModel.find({ reference: { $in: [bodyId] } })
            .sort({ createdAt: -1 })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])
            .limit(10)
            .skip((page - 1) * 10)

        if (posts.length === 0) {
            const error = new Error('No posts found')
            error.status = 404
            return next(error)
        }

        const totalPosts = await UserPostModel.countDocuments({ reference: { $in: [bodyId] } })
        const hasMore = (page - 1) * 10 + posts.length < totalPosts

        res.status(200)
            .json({
                posts: posts,
                totalPosts: totalPosts,
                hasMore: hasMore
            })
    } catch (error) {
        next(error)
    }
})

posts.get('/feed', verifyToken, async (req, res, next) => {
    const token = req.user
    const { page } = req.query || 1

    try {
        const user = await UserModel.findById(token.id)
            .select('following')

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            return next(error)
        }

        const posts = await UserPostModel.find({
            $or: [
                { isPublic: true },
                { userId: { $in: user.following } },
                { userId: token.id }
            ]
        })
            .sort({ createdAt: -1 })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])
            .limit(10)
            .skip((page - 1) * 10)

        if (posts.length === 0) {
            const error = new Error('Posts not found')
            error.status = 404
            return next(error)
        }

        const totalPosts = await UserPostModel.countDocuments({
            $or: [
                { isPublic: true },
                { userId: { $in: user.following } },
                { userId: token.id }
            ]
        })
        const hasMore = (page - 1) * 10 + posts.length < totalPosts

        res.status(200)
            .json({
                posts: posts,
                totalPosts: totalPosts,
                hasMore: hasMore
            })
    } catch (error) {
        next(error)
    }
})

posts.get('/following', verifyToken, async (req, res, next) => {
    const token = req.user
    const { page } = req.query || 1

    try {
        const user = await UserModel.findById(token.id).select('following')

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            return next(error)
        }

        const posts = await UserPostModel.find({ userId: { $in: user.following } })
            .sort({ createdAt: -1 })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])
            .limit(10)
            .skip((page - 1) * 10)

        if (posts.length === 0) {
            const error = new Error('Posts not found')
            error.status = 404
            return next(error)
        }

        const totalPosts = await UserPostModel.countDocuments({ userId: { $in: user.following } })
        const hasMore = (page - 1) * 10 + posts.length < totalPosts

        res.status(200)
            .json({
                posts: posts,
                totalPosts: totalPosts,
                hasMore: hasMore
            })
    } catch (error) {
        next(error)
    }
})

posts.post('/upload', verifyToken, userMediaCloud.array('img', 6), async (req, res, next) => {
    try {
        const imgUrls = req.files.map(file => file.path)

        res.status(200)
            .json({ images: imgUrls })
    } catch (error) {
        next(error)
    }
})

posts.post('/new', verifyToken, async (req, res, next) => {
    const token = req.user
    const {media: postMedia, ...postData} = req.body
    const newPost = new UserPostModel({
        ...postData,
        userId: token.id
    })

    try {
        if (postMedia && postMedia.length > 0) {
            const media = postMedia.map(item => ({
                    userId: token.id,
                    reference: newPost.reference,
                    contentUrl: item
                })
            )

            const savedMedia = await UserMediaModel.insertMany(media)
            newPost.media = savedMedia.map(media => media._id)

        }
        const savedPost = await newPost.save()

        await UserModel.findByIdAndUpdate(token.id, {
            $push: { posts: savedPost._id }
        })

        if (postMedia && postMedia.length > 0) {
            const mediaIds = savedPost.media.map(item => item._id)

            await UserMediaModel.updateMany(
                { _id: { $in: mediaIds } },
                { postRef: savedPost._id }
            )

            await UserModel.findByIdAndUpdate(
                token.id,
                { $push: { media: { $each: mediaIds } } }
            )
        }

        const populatedPost = await UserPostModel.findById(savedPost._id)
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])

        res.status(200)
            .send({
                message: 'Post created successfully',
                populatedPost
            })
    } catch (error) {
        next(error)
    }
})

posts.patch('/like/:postId', verifyToken, async (req, res, next) => {
    const token = req.user
    const { postId } = req.params

    try {
        const post = await UserPostModel.findById(postId)

        if (!post) {
            const error = new Error('Post not found')
            error.status = 404
            return next(error)
        }

        if (!post.likes.includes(token.id)) {
            await Promise.all([
                post.updateOne({ $push: { likes: token.id } }),
                UserModel.findByIdAndUpdate(token.id, {
                    $push: { postsLikes: post._id }
                })
            ])

            res.status(200)
                .send({ message: 'liked' })
        } else {
            await Promise.all([
                post.updateOne({ $pull: { likes: token.id } }),
                UserModel.findByIdAndUpdate(token.id, {
                    $pull: { postsLikes: post._id }
                })
            ])

            res.status(200)
                .send({ message: 'unliked' })
        }
    } catch (error) {
        next(error)
    }
})

posts.patch('/comment/:postId', verifyToken, async (req, res, next) => {
    const token = req.user
    const { postId } = req.params
    const comment = {
        ...req.body,
        userId: token.id,
        timestamp: new Date()
    }

    try {
        const post = await UserPostModel.findById(postId)

        if (!post) {
            const error = new Error('Post not found')
            error.status = 404
            return next(error)
        }

        await post.updateOne({
            $push: { comments: comment }
        })

        const updatedPost = await UserPostModel.findById(postId).populate({ path: 'comments.userId', select: '_id username profilePic' })

        res.status(200)
            .json(updatedPost.comments)
    } catch (error) {
        next(error)
    }
})

module.exports = posts