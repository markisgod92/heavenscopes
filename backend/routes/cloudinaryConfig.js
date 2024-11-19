const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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

module.exports = {userPicsCloud, licensedMediaCloud}