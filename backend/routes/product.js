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
  update,
  list,
  productsTotalNumber,
  listByBrand,
  listBycategory,
  productStar,
  productAverageRating,
} = require('../controllers/productController')

router.post('/product/create', checkAuth, checkAdmin, create)
router.get('/products/totalnumber', productsTotalNumber)
router.get('/products/:count', listAll)
router.delete('/products/delete/:slug', checkAuth, checkAdmin, remove)
router.get('/product/:slug', getProduct)
router.put('/product/:slug', checkAuth, checkAdmin, update)
router.post('/products', list)
router.post('/products/name', listByBrand)
router.post('/products/category', listBycategory)

//Rating
router.put('/product/star/:productId', checkAuth, productStar)
// router.get('/product/rating/:productId', productAverageRating)

module.exports = router
