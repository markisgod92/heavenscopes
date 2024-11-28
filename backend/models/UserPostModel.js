const mongoose = require('mongoose')

const UserPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'celestialBodyModel'
    },
    textContent: {
        type: String
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userMediaModel'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel',
            unique
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
    ]
}, { timestamps: true, strict: true })

module.exports = mongoose.model('postModel', UserPostSchema, 'posts')