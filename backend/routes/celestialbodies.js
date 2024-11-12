const express = require('express')
const CelestialBodyModel = require('../models/CelestialBodyModel')
const celestialBodies = express.Router()

celestialBodies.get('/all', async (req, res, next) => {
    try {
        const bodies = await CelestialBodyModel.find()

        if(bodies.length === 0) {
            const error = new Error('Bodies database is empty.')
            error.status = 404
            return next(error)
        }

        res.status(200)
            .json(bodies)
    } catch (error) {
        next(error)
    }
})

module.exports = celestialBodies