const express = require('express')
const UserModel = require('../models/UserModel')
const users = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const verifyOwner = require('../middlewares/verifyOwner')
require('dotenv').config()

users.get('/me', verifyToken, verifyOwner, async (req, res, next) => {
    const token = req.header('Authorization')

    try {
        const tokenData = jwt.decode(token)
        const user = await UserModel.findById(tokenData.id)

        if(!user) {
            const error = new Error('User not found')
            error.status = 400
            return next(error)
        }

        const { password, ...userData } = user

        res.status(200)
            .json({userData})
    } catch {
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
        
        const token = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )
        
        res.header('Authorization', token)
            .status(200)
            .send({message: 'Log in successfull.'})
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

        const token = jwt.sign(
            { username: user.username, id: user._id },
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
        const updatedUser = await UserModel.findByIdAndUpdate(userId, newData, {new: true})

        const token = jwt.sign(
            { username: updatedUser.username, id: updatedUser._id },
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