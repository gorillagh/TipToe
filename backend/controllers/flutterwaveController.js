const uniqid = require('uniqid')
const axios = require('axios')

const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const Flutterwave = require('flutterwave-node-v3')
const flw = new Flutterwave(
  'FLWPUBK_TEST-492e178f1bffe040075b7a4f7a722db0-X',
  'FLWSECK_TEST-19b4511496ea41b1c574e0fb9add9045-X'
)

exports.charge = async (req, res) => {
  try {
    const { couponApplied } = req.body
    // 1 find the user
    const user = await User.findOne({ email: req.user.email }).exec()
    // // 2 get user cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: user._id,
    }).exec()
    console.log(
      'Cart Total---->',
      cartTotal,
      'Total After Discount----->',
      totalAfterDiscount
    )
    let finalAmount = 0
    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount
    } else {
      finalAmount = cartTotal
    }

    const body = {
      tx_ref: uniqid(),
      amount: finalAmount,
      currency: 'GHS',
      redirect_url: 'http://localhost:3000',
      payment_options: 'card mobilemoneyghana',
      meta: {
        consumer_id: user._id,
        consumer_mac: '92a3-912ba-1192a',
      },
      customer: {
        email: user.email,
        phonenumber: user.phone && user.phone,
        name: user.name,
      },
      customizations: {
        title: 'TipToe Invoice Slip',
        description: 'Payment of items in shopping cart',
        logo: 'https://res.cloudinary.com/gorillasystemsgh/image/upload/v1633686816/favicon_kbwjhi.ico',
      },
    }

    axios({
      method: 'post',
      url: 'https://api.flutterwave.com/v3/payments',
      data: body,

      headers: {
        Authorization: 'Bearer FLWSECK_TEST-19b4511496ea41b1c574e0fb9add9045-X',
      },
    })
      .then((response) => {
        res.json({
          payment: response.data,
          cartTotal,
          totalAfterDiscount,
          payable: finalAmount,
        })
        console.log('Response------->', response)
      })
      .catch((err) => console.log(err))
  } catch (error) {
    console.log(error)
  }
}
