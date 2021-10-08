const express = require('express')
const router = express.Router()

//controller
const { charge } = require('../controllers/flutterwaveController')

//middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/flutterwave', checkAuth, charge)

module.exports = router
