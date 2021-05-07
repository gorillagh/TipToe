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
} = require('../controllers/subCategoryController')

router.post('/subcategory/create', checkAuth, checkAdmin, create)
router.get('/subcategory-list', list)
router.get('/subcategory-list/:slug', read)
router.put('/subcategory-list/update/:slug', checkAuth, checkAdmin, update)
router.delete('/subcategory-list/delete/:slug', checkAuth, checkAdmin, remove)
module.exports = router
