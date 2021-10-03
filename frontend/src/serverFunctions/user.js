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
  await axios.put(
    `${process.env.REACT_APP_API_URL}/user/cart`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  )
