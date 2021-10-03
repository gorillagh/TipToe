const express = require('express')

const router = express.Router()

//Middlewares
const { checkAuth } = require('../middlewares/authMiddleware')

//Controllers
const {
  userCart,
  getUserCart,
  emptyUserCart,
} = require('../controllers/userController')

router.post('/user/cart', checkAuth, userCart)
router.get('/user/cart', checkAuth, getUserCart)
router.put('/user/cart', checkAuth, emptyUserCart)

// router.get('/user', (req, res) => {
//   res.json({
//     data: 'hey you hit user API endpoint',
//   })
// })

module.exports = router
