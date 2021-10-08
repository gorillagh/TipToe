const express = require('express')
const router = express.Router()

//controller
const { createPaymentIntent } = require('../controllers/stripeController')

//middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/create-payment-intent', checkAuth, createPaymentIntent)

module.exports = router
