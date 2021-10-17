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

export const verifyTransactionAndCreateOrder = async (
  transactionId,
  authtoken
) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/flutterwave/verify-transaction`,
    {
      transactionId,
    },
    {
      headers: {
        authtoken,
      },
    }
  )
