const mongoose = require('mongoose')

const InfoChapterSchema = new mongoose.Schema({
    celestialBodyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'celestialBodyModel'
    },
    locale: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    creditInfo: {
        type: String
    },
    media: [
        {
            mediaUrl: { type: String },
            description: { type: String },
            credits: { type: String }
        }
    ]
}, {timestamps: true, strict: true})

module.exports = mongoose.model('infoChapterModel', InfoChapterSchema, 'info-chapters')