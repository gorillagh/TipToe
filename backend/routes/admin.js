const express = require('express')

const router = express.Router()

//Middlewares
const { checkAuth, checkAdmin } = require('../middlewares/authMiddleware')

const { orders, orderStatus } = require('../controllers/adminController')

//routes
router.get('/admin/orders', checkAuth, checkAdmin, orders)
router.put('/admin/order-status', checkAuth, checkAdmin, orderStatus)

module.exports = router
