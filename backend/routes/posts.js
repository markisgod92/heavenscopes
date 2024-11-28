const express = require('express')
const UserModel = require('../models/UserModel')
const UserPostModel = require('../models/UserPostModel')
const posts = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const verifyOwner = require('../middlewares/verifyOwner')
require('dotenv').config()

posts.get('/:postId', verifyToken, async (req, res, next) => {
    const { postId } = req.params

    try {
        const post = await UserPostModel.findById(postId)
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                { path: 'likes', select: '_id username profilePic' },
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

    try {
        const user = await UserModel.findById(userId)

        if (!user) {
            const error = new Error('User not found')
            error.status = 400
            return next(error)
        }

        const posts = await UserPostModel.find({ userId: userId })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                { path: 'likes', select: '_id username profilePic' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])

        if (posts.length === 0) {
            const error = new Error('No posts found')
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(posts)
    } catch (error) {
        next(error)
    }
})

posts.get('/by-body/:bodyId', verifyToken, async (req, res, next) => {
    const { bodyId } = req.params

    try {
        const posts = await UserPostModel.find({ reference: bodyId })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                { path: 'likes', select: '_id username profilePic' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])

        if (posts.length === 0) {
            const error = new Error('No posts found')
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(posts)
    } catch (error) {
        next(error)
    }
})

posts.get('/following', verifyToken, async (req, res, next) => {
    const token = req.user

    try {
        const user = await UserModel.findById(token.id).select('following')

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            return next(error)
        }

        const posts = await UserPostModel.find({ userId: { $in: user.following } })
            .populate([
                { path: 'userId', select: '_id username profilePic' },
                { path: 'reference', select: '_id primaryName' },
                { path: 'media' },
                { path: 'likes', select: '_id username profilePic' },
                {
                    path: 'comments.userId',
                    select: '_id username profilePic'
                }
            ])

        if (posts.length === 0) {
            const error = new Error('Posts not found')
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(posts)
    } catch (error) {
        next(error)
    }
})

posts.post('/new', verifyToken, async (req, res, next) => {
    const token = req.user
    const newPost = new UserPostModel({
        ...req.body,
        userId: token.id
    })

    try {
        const savedPost = await newPost.save()

        await UserModel.findByIdAndUpdate(token.id, {
            $push: { posts: savedPost._id }
        })

        res.status(200)
            .send({
                message: 'Post created successfully'
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
                .send({ message: 'Post liked' })
        } else {
            await Promise.all([
                post.updateOne({ $pull: { likes: token.id } }),
                UserModel.findByIdAndUpdate(token.id, {
                    $pull: { postsLikes: post._id }
                })
            ])

            res.status(200)
                .send({ message: 'Post unliked' })
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

        res.status(200)
            .send({ message: 'Comment added' })
    } catch (error) {
        next(error)
    }
})

module.exports = posts