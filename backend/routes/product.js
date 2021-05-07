const express = require('express')

const router = express.Router()

//Middleware
const { checkAuth, checkAdmin } = require('../middlewares/authMiddleware')

//Controller
const {
  create,
  listAll,
  remove,
  getProduct,
} = require('../controllers/productController')

router.post('/product/create', checkAuth, checkAdmin, create)
router.get('/products/:count', listAll)
router.delete('/products/delete/:slug', checkAuth, checkAdmin, remove)
router.get('/product/:slug', getProduct)

module.exports = router
