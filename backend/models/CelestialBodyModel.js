const mongoose = require('mongoose')
const celestialBodyTypes = require('../data/celestial-body-types.json')

const CelestialBodySchema = new mongoose.Schema({
    primaryName: {
        type: String
    },
    localizedNames: {
        type: Map,
        of: String
    },
    bodyType: {
        type: String,
        enum: celestialBodyTypes
    },
    hasMoons: {
        type: Boolean
    },
    moons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'celestialBodyModel'
        }
    ],
    licensedMedia: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'licensedMediaModel'
        }
    ],
    model3D: {
        isCustomModel: {
            type: Boolean
        },
        textureUrl: {
            type: String
        },
        modelUrl: {
            type: String
        }
    },
    infoSections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'infoChapterModel'
        }
    ]
}, {timestamps: true, strict: true})

module.exports = mongoose.model('celestialBodyModel', CelestialBodySchema, 'celestial-bodies')