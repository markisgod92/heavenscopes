const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        min: 8
    },
    profilePic: {
        type: String,
        default: 'https://picsum.photos/200'
    },
    bio: {
        type: String
    },
    githubId: {
        type: String,
        sparse: true
    },
    discordId: {
        type: String,
        sparse: true
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
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('userModel', UserSchema, 'users')