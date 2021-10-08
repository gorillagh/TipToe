const express = require('express')
const router = express.Router()

//Middleware
const { checkAuth, checkAdmin } = require('../middlewares/authMiddleware')

//Controller
const { create, list, remove } = require('../controllers/couponController')

//routes
router.post('/coupon', checkAuth, checkAdmin, create)
router.get('/coupons', list)
router.delete('/coupon/:couponId', checkAuth, checkAdmin, remove)

module.exports = router
