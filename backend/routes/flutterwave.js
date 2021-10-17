const express = require('express')
const router = express.Router()

//controller
const {
  charge,
  verifyTransactionAndCreateOrder,
} = require('../controllers/flutterwaveController')

//middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/flutterwave', checkAuth, charge)
router.post(
  '/flutterwave/verify-transaction',
  checkAuth,
  verifyTransactionAndCreateOrder
)

module.exports = router
