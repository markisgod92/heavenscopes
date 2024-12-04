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
    }
})

module.exports = mongoose.model('userMediaModel', UserMediaSchema, 'user-media')