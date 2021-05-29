const SubCategory = require('../models/subCategory')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body
    const newSubCategory = await new SubCategory({
      name,
      parent,
      slug: slugify(name),
    }).save()
    res.json(newSubCategory)
    // console.log('Sub category Added -->', newSubCategory)
  } catch (error) {
    res.status(400).json({ message: 'Create sub category Failed' })
  }
}

exports.list = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({})
      .sort({ createdAt: -1 })
      .exec()
    res.json(subCategories)
  } catch (error) {
    res.status(403).json({ message: 'Failed to retrieve sub categories' })
  }
}

exports.update = async (req, res) => {
  try {
    const { slug } = await req.params
    slug.toLowerCase()
    const { name, parent } = await req.body
    const updatedSubCategory = await SubCategory.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name), parent },
      { new: true }
    ).exec()
    res.json(updatedSubCategory)
    // console.log('Sub category updated --> ', updatedSubCategory)
  } catch (error) {
    res.status(403).json({ message: 'Failed to update sub category' })
  }
}

exports.remove = async (req, res) => {
  try {
    const { slug } = await req.params
    slug.toLowerCase()
    const deleted = await SubCategory.findOneAndDelete({ slug }).exec()
    // console.log('Sub category deleted --> ', deleted)
    res.json({
      message: 'Sub category deleted',
      SubCategory: deleted,
    })
  } catch (error) {
    res.status(403).json({ message: 'Unable to delete sub category' })
    console.log(error)
  }
}

exports.read = async (req, res) => {
  try {
    const { slug } = req.params
    slug.toLowerCase()
    const subCategory = await SubCategory.findOne({ slug }).exec()
    res.json(subCategory)
  } catch (error) {
    console.log(error)
    res.status(403).json({
      message: 'Could not retrieve sub category',
    })
  }
}
