const express = require('express')

const router = express.Router()

//Middleware
const { checkAuth, checkAdmin } = require('../middlewares/authMiddleware')

//Controller
const {
  create,
  read,
  update,
  remove,
  list,
  getSubCategories,
} = require('../controllers/categoryController')

router.post('/category-list/create', checkAuth, checkAdmin, create)
router.get('/category-list', list)
router.get('/category-list/:slug', read)
router.put('/category-list/update/:slug', checkAuth, checkAdmin, update)
router.delete('/category-list/delete/:slug', checkAuth, checkAdmin, remove)
router.get('/category/subcategories/:_id', getSubCategories)

module.exports = router
