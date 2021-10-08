import axios from 'axios'

export const getCoupons = async () =>
  await axios.get(`${process.env.REACT_APP_API_URL}/coupons`)

export const removeCoupon = async (couponId, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API_URL}/coupon/${couponId}`, {
    headers: {
      authtoken,
    },
  })

export const createCoupon = async (coupon, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/coupon`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  )
