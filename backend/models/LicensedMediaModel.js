const mongoose = require('mongoose')

const LicensedMediaSchema = new mongoose.Schema({
    celestialBodyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'celestialBodyModel'
    },
    title: {
        type: String
    },
    mediaUrl: {
        type: String
    },
    description: {
        type: String
    },
    creditInfo: {
        type: String
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('licensedMediaModel', LicensedMediaSchema, 'licensed-media')