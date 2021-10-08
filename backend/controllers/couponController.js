const Coupon = require('../models/coupon')
const User = require('../models/user')
const Cart = require('../models/cart')

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon
    res.json(
      await new Coupon({
        name,
        expiry,
        discount,
      }).save()
    )
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec())
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec())
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
