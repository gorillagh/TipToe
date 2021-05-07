const express = require('express')

const router = express.Router()

//Middleware
const { checkAuth, checkAdmin } = require('../middlewares/authMiddleware')

//Controller
const {
  createOrUpdateUser,
  currentUser,
  checkEmail,
} = require('../controllers/authController')

router.post('/create-or-update-user', checkAuth, createOrUpdateUser)
router.post('/current-user', checkAuth, currentUser)
router.post('/current-admin', checkAuth, checkAdmin, currentUser)
router.post('/check-email-availability', checkEmail)

module.exports = router
