const mongoose = require('mongoose')

const UserMediaSchema = new mongoose.Schema({
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
    postRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel'
    },
    contentUrl: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model('userMediaModel', UserMediaSchema, 'user-media')