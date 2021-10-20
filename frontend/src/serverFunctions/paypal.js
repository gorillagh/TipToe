import axios from 'axios'

export const createPaypalIntent = async (coupon, authtoken) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/create-paypal-intent`,
    { couponApplied: coupon },
    {
      headers: {
        'content-type': 'application/json',
        authtoken,
      },
    }
  )

export const verifyPaypalTransactionAndCreateOrder = async (
  orderId,
  authtoken
) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/verify-paypal-transaction`,
    { orderId },
    {
      headers: {
        'content-type': 'application/json',
        authtoken,
      },
    }
  )
