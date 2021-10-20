const User = require('../models/user')
const Order = require('../models/order')
const Cart = require('../models/cart')
const Product = require('../models/product')
// 1. Set up your server to make calls to PayPal

// 1a. Import the SDK package
const paypal = require('@paypal/checkout-server-sdk')

// 1b. Import the PayPal SDK client that was created in `Set up Server-Side SDK`.
/**
 *
 * PayPal HTTP client dependency
 */
const { client } = require('../config/paypalConfig')

// 2. Set up your server to receive a call from the client
exports.paypalIntent = async (req, res) => {
  const { couponApplied } = req.body

  // 1 find the user
  const user = await User.findOne({ email: req.user.email }).exec()

  // 2 get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  }).exec()

  let finalAmount = 0

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount
  } else {
    finalAmount = cartTotal
  }

  // 5. Return a successful response to the client with the order ID
  res.status(200).json({
    // orderId: order.result,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  })
}

exports.verifyPaypalTransactionAndCreateOrder = async (req, res) => {
  // 2a. Get the order ID from the request body
  const { orderId } = req.body

  // 3. Call PayPal to get the transaction details
  let request = new paypal.orders.OrdersGetRequest(orderId)

  let order
  try {
    order = await client().execute(request)
  } catch (err) {
    // 4. Handle any errors from the call
    console.error(err)
    return res.send(500)
  }

  // 5. Validate the transaction details are as expected
  // if (order.result.purchase_units[0].amount.value !== '220.00') {
  //   return res.send(400)
  // }

  //check if order is valid
  if (order.result.id && order.result.status === 'COMPLETED') {
    //check if the database already contains the orderId
    const orderExists = await Order.findOne({
      'paymentIntent.id': order.result.id.toString(),
    }).exec()
    if (orderExists) {
      console.log('Order Exists-------->', orderExists)
      res.json({ ok: true, newOrder: orderExists })
    }
    if (!orderExists) {
      const user = await User.findOne({ email: req.user.email }).exec()

      const userCart = await Cart.findOne({ orderedBy: user._id }).exec()
      let myAmount
      if (
        Number(order.result.purchase_units[0].amount.value) ===
        Number(userCart.cartTotal)
      ) {
        myAmount = Number(userCart.cartTotal)
      } else if (
        Number(order.result.purchase_units[0].amount.value) ===
        Number(userCart.totalAfterDiscount)
      ) {
        myAmount = Number(userCart.totalAfterDiscount)
      }

      const newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
          id: order.result.id.toString(),
          amount: myAmount,
          // amount: Number(order.result.purchase_units[0].amount.value),
          currency: 'usd',
          status: order.result.status,
          // created: Date.now(),
          created: order.result.create_time,
          payment_method_types: ['paypal'],
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
    } else {
      res.json({ ok: false })
    }
  } else {
    res.json({ ok: false })
  }
}
