const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.userCart = async (req, res) => {
  console.log('useCart request body===>', req.body)
  const { cart } = req.body

  let products = []

  //Check if the user has cart already
  const user = await User.findOne({ email: req.user.email }).exec()
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec()
  // if user already has cart, remove it
  if (cartExistByThisUser) {
    cartExistByThisUser.remove()
    console.log('removed old cart')
  }

  //Get products in cart, add count, color and total price and save in cart database
  for (let i = 0; i < cart.length; i++) {
    let object = {}
    object.product = cart[i]._id
    object.count = cart[i].count
    object.color = cart[i].color
    //get price for creating total
    let { price } = await Product.findById(cart[i]._id).select('price')
    object.price = price

    products.push(object)
  }

  // console.log('products', products)

  let cartTotal = 0
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count
  }

  // console.log('CartTotal', cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save()

  console.log('New Cart===>', newCart)
  res.json({ ok: true })
}

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()

  const cart = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec()

  const { products, cartTotal, totalAfterDiscount } = cart
  res.json({ products, cartTotal, totalAfterDiscount })
}

exports.emptyUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()

  res.json({ success: true, removedCart: cart })
}