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
                `${event.data.channel} (${event.data.authorization.bank})`,
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
    const eventBody = await req.body
    client().notification.webhookEvent.getAndVerify(
      eventBody,
      async (error, response) => {
        if (error) {
          console.log(error)
          throw error
        } else {
          console.log(response)
          if (response.event_type === 'CHECKOUT.ORDER.APPROVED') {
            console.log('====Approved====')
            //check if the database already contains the orderId
            const orderExists = await Order.findOne({
              'paymentIntent.id': response.resource.id.toString(),
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
              let myAmount
              if (
                Number(response.resource.purchase_units[0].amount.value) ===
                Number(userCart.cartTotal)
              ) {
                myAmount = Number(userCart.cartTotal)
              } else if (
                Number(response.resource.purchase_units[0].amount.value) ===
                Number(userCart.totalAfterDiscount)
              ) {
                myAmount = Number(userCart.totalAfterDiscount)
              }

              const newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                  id: response.resource.id.toString(),
                  amount: myAmount,
                  // amount: Number(order.result.purchase_units[0].amount.value),
                  currency: 'usd',
                  status: response.resource.status,
                  // created: Date.now(),
                  created: response.resource.create_time,
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
              res.send(200)
            } else {
              res.json({ ok: false })
            }
          } else {
            res.json({ ok: false })
          }
        }
      }
    )
  } catch (error) {
    console.log('Paypal webhook error---->', error)
  }
}
