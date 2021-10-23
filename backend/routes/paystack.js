const express = require('express')
const router = express.Router()

//controller
const {
  createTransaction,
  verifyTransactionAndCreateOrder,
} = require('../controllers/paystackController')

//middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/paystack', checkAuth, createTransaction)
router.post(
  '/paystack/verify-transaction',
  checkAuth,
  verifyTransactionAndCreateOrder
)

module.exports = router
