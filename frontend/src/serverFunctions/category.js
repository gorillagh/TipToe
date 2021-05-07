import axios from 'axios'

export const createCategory = async (authToken, name) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/category-list/create`,
    { name },
    {
      headers: {
        authToken,
      },
    }
  )
}

export const viewCategories = async () =>
  await axios.get(`${process.env.REACT_APP_API_URL}/category-list`)

export const viewCategory = async (category) =>
  await axios.get(`${process.env.REACT_APP_API_URL}/category-list/${category}`)

  export const getSubCategories = async(_id)=>
 await axios.get(`${process.env.REACT_APP_API_URL}/category/subcategories/${_id}`)

export const updateCategory = async (authtoken, category, name) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/category-list/update/${category}`,
    { name },
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const deleteCategory = async (authtoken, category) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/category-list/delete/${category}`,
    {
      headers: {
        authtoken,
      },
    }
  )
}

