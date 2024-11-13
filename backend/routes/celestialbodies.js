const express = require('express')
const CelestialBodyModel = require('../models/CelestialBodyModel')
const celestialBodies = express.Router()
const celestialBodyTypes = require('../data/celestial-body-types.json')
const licensedMediaCloud = require('../routes/cloudinaryConfig')
const LicensedMediaModel = require('../models/LicensedMediaModel')
const isAdmin = require('../middlewares/isAdmin')
const InfoChapterModel = require('../models/InfoChapters')

celestialBodies.get('/all', async (req, res, next) => {
    const { type } = req.query

    if(type && !celestialBodyTypes.includes(type)) {
        const error = new Error(`Type ${type} not valid.`)
        error.status = 400
        return next(error)
    }

    const filter = type ? { bodyType: type } : {}

    try {
        const bodies = await CelestialBodyModel.find(filter)

        if(bodies.length === 0) {
            const error = new Error('Celestial bodies database is empty.')
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(bodies)
    } catch (error) {
        next(error)
    }
})

celestialBodies.get('/:bodyId', async (req, res, next) => {
    const { bodyId } = req.params
    const { moons, media, info } = req.query

    let populateFields = []
    if(moons) populateFields.push('moons')
    if(media) populateFields.push('licensedMedia')
    if(info) populateFields.push('infoSections')

    try {
        const body = await CelestialBodyModel.findById(bodyId).populate(populateFields)

        if(!body) {
            const error = new Error(`Celestial body with id ${bodyId} not found.`)
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(body)
    } catch (error) {
        next(error)
    }
})

celestialBodies.get('/by-name/:bodyName', async (req, res, next) => {
    const { bodyName } = req.params
    const { moons, media, info } = req.query

    let populateFields = []
    if(moons) populateFields.push('moons')
    if(media) populateFields.push('licensedMedia')
    if(info) populateFields.push('infoSections')

    try {
        const body = await CelestialBodyModel.findOne({ primaryName: bodyName }).populate(populateFields)

        if(!body) {
            const error = new Error(`Celestial body with id ${bodyId} not found.`)
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(body)
    } catch (error) {
        next(error)
    }
})


// ADMIN ONLY routes

celestialBodies.post('/new-body', isAdmin, async (req, res, next) => {
    const newBody = new CelestialBodyModel(req.body)

    try {
        const postBody = await newBody.save()

        res.status(201)
            .json(postBody)
    } catch (error) {
        next(error)
    }
})

celestialBodies.post('/upload-media', isAdmin, licensedMediaCloud.single('media'), async (req, res, next) => {
    try {
        res.status(200)
            .json({ media: req.file.path })
    } catch (error) {
        next(error)
    }
})

celestialBodies.post('/licensed-media/:bodyId', isAdmin, async (req, res, next) => {
    const { bodyId } = req.params
    const newMedia = new LicensedMediaModel({
        ...req.body,
        celestialBodyRef: bodyId
    })

    try {
        const postMedia = await newMedia.save()
        await CelestialBodyModel.findByIdAndUpdate(bodyId, {
            $push: { licensedMedia: postMedia._id }
        })

        res.status(201)
            .json(postMedia)
    } catch (error) {
        next(error)
    }
})

celestialBodies.post('/info-chapter/:bodyId', isAdmin, async(req, res, next) => {
    const { bodyId } = req.params
    const newChapter = new InfoChapterModel({
        ...req.body,
        celestialBodyRef: bodyId
    })

    try {
        const postChapter = await newChapter.save()
        await CelestialBodyModel.findByIdAndUpdate(bodyId, {
            $push: { infoSections: postChapter._id }
        })

        res.status(201)
            .json(postChapter)
    } catch (error) {
        next(error)
    }
})

module.exports = celestialBodies