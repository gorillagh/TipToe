const uniqid = require('uniqid')
const axios = require('axios')
var request = require('request')

const User = require('../models/user')
const Order = require('../models/order')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')

exports.createTransaction = async (req, res) => {
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
      finalAmount = totalAfterDiscount * 100
    } else {
      finalAmount = cartTotal * 100
    }

    const body = {
      email: req.user.email,
      amount: finalAmount.toString(),
      callback_url: 'http://localhost:3000/paystack/order/result/ps',
      currency: 'GHS',
      channels: ['card', 'mobile_money'],
    }

    axios({
      method: 'post',
      url: 'https://api.paystack.co/transaction/initialize',
      data: body,

      headers: {
        'content-Type': 'application/json',
        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })
      .then((response) => {
        res.json({
          transaction: response.data,
          cartTotal,
          totalAfterDiscount,
          payable: finalAmount,
        })
        // console.log('Response------->', response)
      })
      .catch((err) => console.log(err))
  } catch (error) {
    console.log(error)
  }
}

exports.verifyTransactionAndCreateOrder = async (req, res) => {
  try {
    const { transactionRef } = await req.body
    console.log('transaction reference ----->', transactionRef)

    if (transactionRef) {
      axios({
        method: 'get',
        url: `https://api.paystack.co/transaction/verify/${transactionRef}`,
        headers: {
          authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      })
        .then(async (response) => {
          console.log(response.data)
          if (response.data.data.status === 'success') {
            const orderExists = await Order.findOne({
              'paymentIntent.id': response.data.data.reference,
            }).exec()

            if (orderExists) {
              console.log('Order Exists-------->', orderExists)
              res.json({ ok: true, newOrder: orderExists })
            }
            if (!orderExists) {
              const user = await User.findOne({ email: req.user.email }).exec()

              const userCart = await Cart.findOne({
                orderedBy: user._id,
              }).exec()

              const newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                  id: response.data.data.reference.toString(),
                  amount: response.data.data.amount / 100,
                  currency: 'usd',
                  status: response.data.data.status,
                  // created: Date.now(),
                  created: response.data.data.created_at,
                  payment_method_types: [
                    `${response.data.data.authorization.bank} ${response.data.data.channel}`,
                  ],
                },
                orderedBy: user._id,
              }).save()

              // Decrement product and increment sold
              let bulkOption = userCart.products.map((product) => {
                return {
                  updateOne: {
                    filter: { _id: product.product._id },
                    update: {
                      $inc: { quantity: -product.count, sold: +product.count },
                    },
                  },
                }
              })

              let updated = await Product.bulkWrite(bulkOption, {})
              // console.log('Product quantity-- and sold++----->', updated)

              console.log('Stack ORDER SAVED----->>', newOrder)
              res.json({ newOrder, ok: true })
            }
          } else {
            res.json({ ok: false })
          }
        })
        .catch((err) => console.log(err))
    } else {
      res.json({ ok: false })
    }
  } catch (error) {
    console.log(error)
  }
}
