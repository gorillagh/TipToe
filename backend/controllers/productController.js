const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')
const { populate } = require('../models/user')
const product = require('../models/product')

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

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({ email: req.body.email }).exec()
    const { star } = req.body

    let rObject
    product.ratings.forEach((element) => {
      if (element.postedBy.toString() === user._id.toString()) {
        rObject = element
      }
    })

    //who is updating
    //check if currently loged in use has already added a rating
    // const ratingObject = product.ratings.find((element) => {
    //   element.postedBy.toString() === user._id.toString()
    // })

    //if user has not left rating yet, push it
    if (rObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec()
      res.json(ratingAdded)
    }

    //Else if user has already left rating, update it
    else {
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: rObject },
        },
        { $set: { 'ratings.$.star': star } },
        { new: true }
      ).exec()
      res.json(ratingUpdated)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.relatedProductsList = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec()

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(4)
      .populate('category')
      .populate('subcategories')
      .populate('ratings.postedBy', '_id name')
      .exec()

    res.json(relatedProducts)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

// exports.productAverageRating = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId).exec()
//     const { ratings } = await product
//     let total = 0
//     for (let i = 0; i < ratings.length; i++) {
//       total += Number(ratings[i].star)
//     }
//     const averageRating = total / ratings.length
//     console.log('Average rating=========>', averageRating)
//     res.json(averageRating)
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({ message: error.message })
//   }
// }

//Search Filters
const handleQuery = async (req, res, query) => {
  try {
    const products = await Product.find({ $text: { $search: query } })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('ratings.postedBy', '_id name')
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('ratings.postedBy', '_id name')
      .exec()
    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const handleCategory = async (req, res, category) => {
  try {
    const products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('ratings.postedBy', '_id name')
      .exec()

    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        // title: '$title',
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(50)
    .exec((err, aggregates) => {
      if (err) console.log('AGGREGATE ERROR', err)
      Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subcategories', '_id name')
        .populate('ratings.postedBy', '_id name')
        .exec((err, products) => {
          if (err) console.log('PRODUCT AGGREGATE ERROR', err)
          res.json(products)
        })
    })
}

const handleSubCategory = async (req, res, subcategory) => {
  const products = await Product.find({ subcategories: subcategory })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('ratings.postedBy', '_id name')
    .exec()

  res.json(products)
}

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('ratings.postedBy', '_id name')
    .exec()

  res.json(products)
}

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('ratings.postedBy', '_id name')
    .exec()

  res.json(products)
}

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('ratings.postedBy', '_id name')
    .exec()

  res.json(products)
}

exports.searchFilters = async (req, res) => {
  try {
    const {
      query,
      price,
      category,
      stars,
      subcategory,
      brand,
      color,
      shipping,
    } = req.body

    if (query) {
      await handleQuery(req, res, query)
    }
    if (price !== undefined) {
      await handlePrice(req, res, price)
    }
    if (category) {
      await handleCategory(req, res, category)
    }
    if (stars) {
      await handleStar(req, res, stars)
    }
    if (subcategory) {
      await handleSubCategory(req, res, subcategory)
    }
    if (shipping) {
      await handleShipping(req, res, shipping)
    }
    if (brand) {
      await handleBrand(req, res, brand)
    }
    if (color) {
      await handleColor(req, res, color)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
