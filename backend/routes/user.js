const express = require('express')

const router = express.Router()

//Middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

//Controllers
const {
  userCart,
  getUserCart,
  emptyUserCart,
  saveAddressToDb,
  applyCouponToUserCart,
  createOrder,
} = require('../controllers/userController')

router.post('/user/cart', checkAuth, userCart)
router.get('/user/cart', checkAuth, getUserCart)
router.delete('/user/cart', checkAuth, emptyUserCart)
router.post('/user/address', checkAuth, saveAddressToDb)

// Coupon
router.post('/user/cart/coupon', checkAuth, applyCouponToUserCart)

//Create Order
router.post('/user/order', checkAuth, createOrder)

// router.get('/user', (req, res) => {
//   res.json({
//     data: 'hey you hit user API endpoint',
//   })
// })

module.exports = router
