const User = require('../models/user')
const Order = require('../models/order')
const Cart = require('../models/cart')
const Product = require('../models/product')
const crypto = require('crypto')

const paypal = require('@paypal/checkout-server-sdk')

const { client } = require('../config/paypalConfig')

exports.paystackWebhook = async (req, res) => {
  try {
    //Validate event
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex')
    if (hash == req.headers['x-paystack-signature']) {
      // Retrieve the request's body
      const event = req.body
      if (event.event === 'charge.success') {
        const orderExists = await Order.findOne({
          'paymentIntent.id': event.data.reference,
        }).exec()

        if (orderExists) {
          console.log('Order Exists(from webhook)-------->', orderExists)
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
              id: event.data.reference.toString(),
              amount: event.data.amount / 100,
              currency: 'usd',
              status: response.data.data.status,
              // created: Date.now(),
              created: event.data.created_at,
              payment_method_types: [
                `${event.data.authorization.bank} ${event.data.channel}`,
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
          res.send(200)
        } else {
          res.json({ ok: false })
        }
      } else {
        res.json({ ok: false })
      }
    } else {
      res.json({ ok: false })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.paypalWebhook = async (req, res) => {
  try {
    const eventBody = req.body
    client().notification.webhookEvent.getAndVerify(
      eventBody,
      function (error, response) {
        if (error) {
          console.log(error)
          throw error
        } else {
          console.log(response)
          if (response.event_type === 'CHECKOUT.ORDER.APPROVED') {
            console.log('====Approved====')
          }
        }
      }
    )
  } catch (error) {
    console.log('Paypal webhook error---->', error)
  }
}
