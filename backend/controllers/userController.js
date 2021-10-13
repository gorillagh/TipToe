const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const Order = require('../models/order')

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
    console.log('Price ------->', price)
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

exports.saveAddressToDb = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec()
  res.json({ userAddress, ok: true })
}

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body
  console.log('COUPON----->', coupon)

  const validCoupon = await Coupon.findOne({ name: coupon }).exec()
  if (validCoupon === null) {
    return res.json({ err: 'Invalid coupon' })
  }
  console.log('VALID COUPON ------->', validCoupon)

  const user = await User.findOne({ email: req.user.email }).exec()

  let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .exec()

  console.log('Cart Total---->', cartTotal, 'discount', validCoupon.discount)

  //Calculate total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2)

  totalAfterDiscount = Number(totalAfterDiscount)

  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec()

  res.json({ totalAfterDiscount, discount: validCoupon.discount })
}

exports.createOrder = async (req, res) => {
  const { paymentIntent } = await req.body.stripeResponse
  const user = await User.findOne({ email: req.user.email }).exec()

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec()

  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save()

  // Decrement product and increment sold
  let bulkOption = products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product.product._id },
        update: { $inc: { quantity: -product.count, sold: +product.count } },
      },
    }
  })

  let updated = await Product.bulkWrite(bulkOption, {})
  console.log('Product quantity-- and sold++----->', updated)

  console.log('NEW ORDER SAVED', newOrder)
  res.json({ ok: true })
}

exports.getOrders = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec()

    const orders = await Order.find({ orderedBy: user._id })
      .populate('products.product')
      .sort({ createdAt: -1 })
      .exec()
    res.json(orders)
  } catch (error) {
    console.log(error)
  }
}
