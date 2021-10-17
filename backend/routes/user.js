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
  getOrders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
} = require('../controllers/userController')

router.post('/user/cart', checkAuth, userCart)
router.get('/user/cart', checkAuth, getUserCart)
router.delete('/user/cart', checkAuth, emptyUserCart)
router.post('/user/address', checkAuth, saveAddressToDb)

// Coupon
router.post('/user/cart/coupon', checkAuth, applyCouponToUserCart)

//Create Order
router.post('/user/order', checkAuth, createOrder) // Stripe
router.post('/user/cash-order', checkAuth, createCashOrder) //Cash on Delivery
router.get('/user/orders', checkAuth, getOrders)

//wish list
router.post('/user/wishlist', checkAuth, addToWishlist)
router.get('/user/wishlist', checkAuth, wishlist)
router.put('/user/wishlist/:productId', checkAuth, removeFromWishlist)

// router.get('/user', (req, res) => {
//   res.json({
//     data: 'hey you hit user API endpoint',
//   })
// })

module.exports = router
