import axios from 'axios'

export const createProduct = async (authtoken, product) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    product,
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const getProducts = async (number) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/products/${number}`)
}

export const deleteProduct = async (authtoken, slug) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/products/delete/${slug}`,
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const getProduct = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/product/${slug}`)
}

export const updateProduct = async (authtoken, product, slug) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/product/${slug}`,
    product,
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const getProductList = async (
  sort,
  order,
  pageNumber,
  numberPerPage
) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/products`, {
    sort,
    order,
    pageNumber,
    numberPerPage,
  })
}

export const getProductsTotalNumber = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/products/totalnumber`
  )
}

export const getProductsByBrand = async (title, limit) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/products/name`, {
    title,
    limit,
  })
}

export const getProductsBycategory = async (sort, order, categories, limit) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/products/category`,
    {
      sort,
      order,
      categories,
      limit,
    }
  )
}

export const updateProductRating = async (star, _id, email, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/product/star/${_id}`,
    {
      star,
      email,
    },
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const getRelatedProducts = async (productId) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/product/relatedproducts/${productId}`
  )
}
// export const getProductAverageRating = async (_id) => {
//   return await axios.get(
//     `${process.env.REACT_APP_API_URL}/product/rating/${_id}`
//   )
// }
