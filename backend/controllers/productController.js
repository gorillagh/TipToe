const Product = require('../models/product')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.listAll = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subcategories')
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug,
    }).exec()
    res.json(deleted)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('subcategories')
      .exec()
    res.json(product)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec()
    res.json(updatedProduct)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

//Without pagination
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subcategories')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec()
//     console.log(products)
//     res.json(products)
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({ message: error.message })
//   }
// }

//With pagination
exports.list = async (req, res) => {
  try {
    const { sort, order, pageNumber, numberPerPage } = await req.body
    const pageNum = pageNumber || 1

    const products = await Product.find({})
      .skip((pageNum - 1) * numberPerPage)
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .limit(numberPerPage)
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.productsTotalNumber = async (req, res) => {
  try {
    const totalNumber = await Product.find({}).estimatedDocumentCount().exec()
    res.json(totalNumber)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.listByBrand = async (req, res) => {
  try {
    const { title, limit } = req.body
    const products = await Product.find({
      brand: title,
    })
      .populate('category')
      .populate('subcategories')
      .limit(limit)
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.listBycategory = async (req, res) => {
  try {
    let finalProducts = []
    const { sort, order, categories, limit } = await req.body
    const productsInitial = await Product.find({})
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .exec()

    for (let i = 0; i < (await productsInitial.length); i++) {
      if (categories.includes(String(productsInitial[i].category._id))) {
        finalProducts.push(productsInitial[i])
        if (finalProducts.length === limit) {
          break
        }
      }
    }
    res.json(finalProducts)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
