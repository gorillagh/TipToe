const express = require('express')
const router = express.Router()

//controller
const {
  paystackWebhook,
  paypalWebhook,
} = require('../controllers/webhookController')

//middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/paystack/webhook', paystackWebhook)
router.post('/paypal/webhook', paypalWebhook)

module.exports = router
