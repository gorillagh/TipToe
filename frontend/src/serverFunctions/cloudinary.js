import axios from 'axios'

export const uploadImages = async (authToken, image) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/uploadimages`,
    { image },
    {
      headers: {
        authToken,
      },
    }
  )
}

export const removeImage = async (authToken, public_id) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/removeimage`,
    { public_id },
    {
      headers: {
        authToken,
      },
    }
  )
}
