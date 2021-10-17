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

export const fetchOrders = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API_URL}/user/orders`, {
    headers: {
      authtoken,
    },
  })

export const getWishlist = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API_URL}/user/wishlist`, {
    headers: {
      authtoken,
    },
  })

export const addToWishlist = async (productId, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/user/wishlist`,
    {
      productId,
    },
    {
      headers: {
        authtoken,
      },
    }
  )

export const removeFromWishlist = async (productId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API_URL}/user/wishlist/${productId}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  )

export const cashOrder = async (localStorageCOD, coupon, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/user/cash-order`,
    { localStorageCOD, couponApplied: coupon },
    {
      headers: {
        authtoken,
      },
    }
  )
