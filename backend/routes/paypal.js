const express = require('express')
const router = express.Router()

//controller
const {
  paypalIntent,
  verifyPaypalTransactionAndCreateOrder,
} = require('../controllers/paypalController')

//middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/create-paypal-intent', checkAuth, paypalIntent)
router.post(
  '/verify-paypal-transaction',
  checkAuth,
  verifyPaypalTransactionAndCreateOrder
)

module.exports = router
