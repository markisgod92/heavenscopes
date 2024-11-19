const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    profilePic: {
        type: String,
        default: 'https://picsum.photos/200'
    },
    bio: {
        type: String,
        max: 100
    },
    settings: {
        isMetric: {
            type: Boolean,
            default: true
        },
        location: {
            lat: {
                type: Number,
                default: 41.9027835
            },
            lon: {
                type: Number,
                default: 12.4963655
            }
        },
        elevation: {
            type: Number,
            default: 0
        }
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'postModel'
        }
    ],
    postsLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'postModel'
        }
    ],
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userMediaModel'
        }
    ],
    mediaLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userMediaModel'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false,
        sparse: true
    },
    adminPasskey: {
        type: String,
        sparse: true
    }
}, { timestamps: true, strict: true })

UserSchema.pre('save', async function (next) {
    if (this.isModified('isAdmin') && this.isAdmin) {
        const passkey = `${this.username}${Math.random().toString(36).substring(2, 15)}`
        const salt = 10
        const hashedPasskey = await bcrypt.hash(passkey, salt)
        this.adminPasskey = hashedPasskey
    } else {
        this.adminPasskey = undefined
    }

    next()
})

UserSchema.pre('updateOne', async function (next) {
    const update = this.getUpdate()
    if (update.isAdmin !== undefined) {
        if (update.isAdmin === true) {
            const passkey = `${update.username}${Math.random().toString(36).substring(2, 15)}`
            const salt = 10
            const hashedPasskey = await bcrypt.hash(passkey, salt)
            update.adminPasskey = hashedPasskey
        } else if (update.isAdmin === false) {
            update.adminPasskey = undefined
        }
        this.setUpdate(update)
    }

    next()
})

module.exports = mongoose.model('userModel', UserSchema, 'users')