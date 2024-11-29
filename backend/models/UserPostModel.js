const mongoose = require('mongoose')

const UserPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    reference: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'celestialBodyModel'
        }
    ],
    textContent: {
        type: String
    },
    media: [
        {
            /* type: mongoose.Schema.Types.ObjectId,
            ref: 'userMediaModel' */
            type: String
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        }
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'userModel'
            },
            comment: {
                type: String
            },
            timestamp: {
                type: Date
            }
        }
    ],
    isPublic: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model('postModel', UserPostSchema, 'posts')