import axios from 'axios'

export const paystackPayment = async (coupon, authtoken) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/paystack`,
    { couponApplied: coupon },
    {
      headers: {
        authtoken,
      },
    }
  )

export const verifyTransactionAndCreateOrder = async (
  transactionRef,
  authtoken
) =>
  axios.post(
    `${process.env.REACT_APP_API_URL}/paystack/verify-transaction`,
    {
      transactionRef,
    },
    {
      headers: {
        authtoken,
      },
    }
  )
