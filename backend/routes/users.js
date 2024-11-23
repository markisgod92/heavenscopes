const express = require('express')
const UserModel = require('../models/UserModel')
const {userPicsCloud} = require('./cloudinaryConfig')
const users = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const verifyOwner = require('../middlewares/verifyOwner')
require('dotenv').config()

users.get('/me/:userId', verifyToken, verifyOwner, async (req, res, next) => {
    const token = req.user

    try {
        const user = await UserModel.findById(token.id).lean()

        if(!user) {
            const error = new Error('User not found')
            error.status = 400
            return next(error)
        }

        const { password, adminPasskey, ...data } = user

        res.status(200)
            .json(data)
    } catch {
        next(error)
    }
})

users.get('/:userId', verifyToken, async (req, res, next) => {
    const {userId} = req.params

    try {
        const user = await UserModel.findById(userId).lean()

        if(!user) {
            const error = new Error('User not found')
            error.status = 400
            return next(error)
        }

        const { email, password, settings, postsLikes, mediaLikes, isAdmin, adminPasskey, ...data } = user

        res.status(200)
            .json(data)
    } catch (error) {
        next(error)
    }
})

users.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    try {
        const user = await UserModel.findOne({username: username})
        if(!user) {
            const error = new Error('User not found')
            error.status = 400
            return next(error)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            const error = new Error('Password not valid.')
            error.status = 401
            return next(error)
        }

        const payload = {
            username: user.username, 
            id: user._id,
            settings: user.settings,
            profilePic: user.profilePic
        }

        if(user.isAdmin) {
            payload.adminPasskey = user.adminPasskey
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })
        
        res.header('Authorization', token)
            .status(200)
            .send({message: 'Login successful.'})
    } catch (error) {
        next(error)
    }
})

users.post('/upload', userPicsCloud.single('avatar'), async (req, res, next) => {
    try {
        res.status(200)
            .json({ avatar: req.file.path })
    } catch (error) {
        next(error)
    }
})

users.post('/new', async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPw = await bcrypt.hash(req.body.password, salt)

    const newUser = new UserModel({
        ...req.body,
        password: hashedPw
    })

    try {
        const user = await newUser.save()

        const payload = {
            username: user.username, 
            id: user._id,
            settings: user.settings,
            profilePic: user.profilePic
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

        res.header('Authorization', token)
            .status(200)
            .send({message: 'User created successfully.'})
    } catch (error) {
        next(error)
    }
})

users.patch('/:userId', verifyToken, verifyOwner, async (req, res, next) => {
    const {userId} = req.params
    const user = await UserModel.findById(userId)

    if(!user) {
        const error = new Error('User not found.')
        error.status = 400
        return next(error)
    }

    try {
        const newData = req.body
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {$set: newData}, {new: true})

        const payload = {
            username: updatedUser.username, 
            id: updatedUser._id,
            settings: updatedUser.settings,
            profilePic: updatedUser.profilePic
        }
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

        res.header('Authorization', token)
            .status(200)
            .send({message: 'User modified successfully.'})
    } catch (error) {
        next(error)
    }
})

module.exports = users