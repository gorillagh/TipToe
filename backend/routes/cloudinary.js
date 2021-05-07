const express = require('express')
const router = express.Router()

//Middleware
const { checkAuth, checkAdmin } = require('../middlewares/authMiddleware')

//Controller
const { upload, remove } = require('../controllers/cloudinaryController')

router.post('/uploadimages', checkAuth, checkAdmin, upload)
router.post('/removeimage', checkAuth, checkAdmin, remove)

module.exports = router
