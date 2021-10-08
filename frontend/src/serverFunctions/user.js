import axios from 'axios'

export const saveToUserCart = async (cart, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/user/cart`,
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  )

export const getUserCart = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API_URL}/user/cart`, {
    headers: {
      authtoken,
    },
  })

export const emptyUserCart = async (authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API_URL}/user/cart`, {
    headers: {
      authtoken,
    },
  })

export const saveAddressToDb = async (address, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/user/address`,
    { address },
    {
      headers: {
        authtoken,
      },
    }
  )

export const applyDiscount = async (coupon, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/user/cart/coupon`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  )

export const createOrder = async (stripeResponse, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/user/order`,
    { stripeResponse },
    {
      headers: {
        authtoken,
      },
    }
  )
