import axios from 'axios'

export const flutterPayment = async (coupon, authtoken) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/flutterwave`,
    { couponApplied: coupon },
    {
      headers: {
        authtoken,
      },
    }
  )
