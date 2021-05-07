import axios from 'axios'

export const createSubCategory = async (authToken, name, parent) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/subcategory/create`,
    { name, parent },
    {
      headers: {
        authToken,
      },
    }
  )
}

export const viewSubCategories = async () =>
  await axios.get(`${process.env.REACT_APP_API_URL}/subcategory-list`)

export const viewSubCategory = async (subcategory) =>
  await axios.get(
    `${process.env.REACT_APP_API_URL}/subcategory-list/${subcategory}`
  )

export const updateSubCategory = async (
  authtoken,
  subcategory,
  name,
  parent
) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/subcategory-list/update/${subcategory}`,
    { name, parent },
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const deleteSubCategory = async (authtoken, subcategory) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/subcategory-list/delete/${subcategory}`,
    {
      headers: {
        authtoken,
      },
    }
  )
}
