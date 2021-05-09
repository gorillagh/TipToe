const Product = require('../models/product')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title)
    console.log(req.body)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
    console.log('Product Created -->', newProduct)
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
    console.log(deleted)
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
    console.log(updatedProduct)
    res.json(updatedProduct)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
