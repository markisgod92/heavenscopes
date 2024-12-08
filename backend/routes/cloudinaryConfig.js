const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const generateUniqueFileName = (userId) => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '')
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `${userId}_${timestamp}_${randomSuffix}`
}


const userPicsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'heavenscopes/user-profile-pics',
        allowed_formats: ['jpg', 'png', 'gif', 'mp4'],
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name
    }
})

const userPicsCloud = multer({
    storage: userPicsStorage
})


const userMediaStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const userId = req.user.id || 'default'
        const uniqueFileName = generateUniqueFileName(userId)

        return {
            folder: `heavenscopes/user-media/${userId}`,
            allowed_formats: ['jpg', 'png', 'gif', 'mp4'],
            public_id: uniqueFileName
        }
    }
})

const userMediaCloud = multer({
    storage: userMediaStorage,
    fileFilter: (req, file, cb) => {
        const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']
        if (allowedFormats.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file format. Only JPG, PNG, GIF and MP4 are allowed.'))
        }
    }
})


const licensedMediaStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'heavenscopes/licensed-media',
        allowed_formats: ['jpg', 'png', 'gif', 'mp4'],
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name
    }
})

const licensedMediaCloud = multer({
    storage: licensedMediaStorage
})

module.exports = { userPicsCloud, userMediaCloud, licensedMediaCloud }