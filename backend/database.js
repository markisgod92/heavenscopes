const mongoose = require('mongoose')
require('dotenv').config()

const dbInit = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const now = new Date().toISOString()
        console.log(`[${now}] - Database connected successfully.`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = dbInit