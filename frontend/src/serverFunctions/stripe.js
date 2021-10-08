import axios from 'axios'

export const createPaymentIntent = async (coupon, authtoken) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/create-payment-intent`,
    { couponApplied: coupon },
    {
      headers: {
        authtoken,
      },
    }
  )
