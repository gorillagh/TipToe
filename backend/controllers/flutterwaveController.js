const uniqid = require('uniqid')
const axios = require('axios')
var request = require('request')

const User = require('../models/user')
const Order = require('../models/order')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
// const stripe = require('stripe')(process.env.STRIPE_SECRET)
// const Flutterwave = require('flutterwave-node-v3')
// const flw = new Flutterwave(
//   process.env.FLUTTERWAVE_PUBLIC,
//   process.env.FLUTTERWAVE_SECRET
// )

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
      redirect_url: 'http://localhost:3000/order/result',
      payment_options: 'card, mobilemoneyghana, paypal',
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
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_LIVE}`,
      },
    })
      .then((response) => {
        res.json({
          payment: response.data,
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
  // console.log(
  //   'Order Exists-------->',
  //   await Order.findOne({
  //     'paymentIntent.id': 2554997,
  //   }).exec()
  // )

  try {
    const { transactionId } = await req.body
    const options = {
      method: 'GET',
      url: `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_LIVE}`,
      },
    }
    request(options, async (error, response) => {
      try {
        if (error) throw new Error(error)
        const verificationResponse = await JSON.parse(response.body)
        if (verificationResponse.status === 'success') {
          const orderExists = await Order.findOne({
            'paymentIntent.id': verificationResponse.data.tx_ref,
          }).exec()
          console.log(verificationResponse.data)

          if (orderExists) {
            console.log('Order Exists-------->', orderExists)
            res.json({ ok: true, newOrder: orderExists })
          }
          if (!orderExists) {
            const user = await User.findOne({ email: req.user.email }).exec()

            const userCart = await Cart.findOne({ orderedBy: user._id }).exec()

            //If localStorageCOD is true, create order with status of cash on delivery.

            const newOrder = await new Order({
              products: userCart.products,
              paymentIntent: {
                id: verificationResponse.data.tx_ref.toString(),
                amount: verificationResponse.data.amount,
                currency: 'usd',
                status: verificationResponse.data.status,
                // created: Date.now(),
                created: verificationResponse.data.created_at,
                payment_method_types: ['card'],
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

            console.log('CARD ORDER SAVED----->>', newOrder)
            res.json({ newOrder, ok: true })
          }
        } else {
          res.json({ ok: false })
        }
      } catch (error) {
        console.log(error)
        res.json({ ok: false })
      }
    })
  } catch (error) {
    console.log(error)
  }
}
