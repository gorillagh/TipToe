const Category = require('../models/category')
const slugify = require('slugify')
const SubCategory = require('../models/subCategory')

exports.create = async (req, res) => {
  try {
    const { name } = req.body
    const newCategory = await new Category({
      name,
      slug: slugify(name),
    }).save()
    res.json(newCategory)
    // console.log('Category Added -->', newCategory)
  } catch (error) {
    res.status(400).json({ message: 'Create Category Failed' })
  }
}

exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec()
    res.json(categories)
  } catch (error) {
    res.status(403).json({ message: 'Failed to retrieve categories' })
  }
}

exports.update = async (req, res) => {
  try {
    const { slug } = await req.params
    slug.toLowerCase()
    const { name } = await req.body
    const updatedCategory = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name) },
      { new: true }
    ).exec()
    res.json(updatedCategory)
    // console.log('Category updated --> ', updatedCategory)
  } catch (error) {
    res.status(403).json({ message: 'Failed to update category' })
  }
}

exports.remove = async (req, res) => {
  try {
    const { slug } = await req.params
    slug.toLowerCase()
    const deleted = await Category.findOneAndDelete({ slug })
    // console.log('Category deleted --> ', deleted)
    res.json({
      message: 'Category deleted',
      Category: deleted,
    })
  } catch (error) {
    res.status(403).json({ message: 'Unable to delete category' })
    console.log(error)
  }
}

exports.read = async (req, res) => {
  try {
    const { slug } = req.params
    slug.toLowerCase()
    const category = await Category.findOne({ slug }).exec()
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(403).json({
      message: 'Could not retrieve Category',
    })
  }
}

// exports.getSubCategories = async (req, res) =>{
//     SubCategory.find({parent: req.params._id}).exec((err, subCategories)=>{
//       if(err) console.log(error);
//       res.json(subCategories);
//     })
//     console.log(subCategories)

// }

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      parent: req.params._id,
    }).exec()
    // console.log(subCategories)
    res.json(subCategories)
  } catch (error) {
    console.log(error)
    res.status(403).json({
      message: 'Could not retrieve Category',
    })
  }
}
