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
  relatedProductsList,
  searchFilters,
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

//Related Products
router.get('/product/relatedproducts/:productId', relatedProductsList)

//Search
router.post('/search/filters', searchFilters)

module.exports = router
