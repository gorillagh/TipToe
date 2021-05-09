import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SaveOutlined, LoadingOutlined } from '@ant-design/icons'

import AdminNav from '../../../components/Navbar/AdminNav'
import { getProduct, updateProduct } from '../../../serverFunctions/product'
import { toast } from 'react-toastify'
import UpdateProductForm from '../../../components/Forms/UpdateProductForm'
import {
  viewCategories,
  getSubCategories,
} from '../../../serverFunctions/category'
import FileUpload from '../../../components/Forms/FileUpload'

const initialValues = {
  title: '',
  description: '',
  price: '',
  category: '--Select One--',
  subcategories: [],
  shipping: '--Select One--',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  color: '--Select One--',
  brands: [
    'Apple',
    'Samsung',
    'Microsoft',
    'Lenovo',
    'Asus',
    'Bose',
    'Sony',
    'Thrustmaster',
  ],
  brand: '--Select One--',
  sold: '',
}

const UpdateProduct = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [subCategories, setSubCategories] = useState([])
  const [arrayOfSubCategories, setArrayOfSubCategories] = useState([])
  const [disableSubCategories, setDisableCategories] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadProduct()
    loadCategories()
  }, [])

  const loadProduct = async () => {
    setLoading(true)
    await getProduct(match.params.slug)
      .then((product) => {
        setLoading(false)
        console.log('Product', product.data)
        //1. load single product
        setValues({ ...values, ...product.data })
        //2. get the product subcategories
        getSubCategories(product.data.category._id).then((res) =>
          setSubCategories(res.data)
        ) //on first load, show default subcategories

        //3 Prepare array of sub ids to show as default values in ant.design select
        let arr = []
        product.data.subcategories.map((s) => arr.push(s._id))
        setArrayOfSubCategories((prev) => arr) // Required for ant design select to work
        setDisableCategories(false)
      })

      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const loadCategories = async () => {
    const Categories = await viewCategories()
    // console.log(Categories.data)
    setCategories(Categories.data)
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleCategoryChange = (e) => {
    e.preventDefault()
    setValues({ ...values, subcategories: [] })

    setSelectedCategory(e.target.value)

    getSubCategories(e.target.value).then((res) => {
      setSubCategories(res.data)
    })
    setDisableCategories(false)

    //If user clicks to the original category
    //show its subcategories as default
    if (values.category._id === e.target.value) {
      loadProduct()
    }
    setArrayOfSubCategories([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    values.category = selectedCategory ? selectedCategory : values.category
    values.subcategories = arrayOfSubCategories

    updateProduct(user.token, values, match.params.slug)
      .then((res) => {
        setLoading(false)
        toast.success(`"${res.data.title}" Updated`)
        history.push('/admin/products')
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        toast.error(error.response.data.message)
      })
  }

  //This is for the wave effect on form inputs
  const labels = document.querySelectorAll('.form-group .label')
  labels.forEach((label) => {
    label.innerHTML = label.innerText
      .split('')
      .map(
        (letter, idx) =>
          `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
      )
      .join('')
  })

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-6'>
          <header className='header'>
            {loading ? (
              <h1 className='text-center'>
                <LoadingOutlined />
              </h1>
            ) : (
              <h5 className='text-center'>Update Product</h5>
            )}
          </header>

          <hr />

          <div className='p-3'>
            <FileUpload
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              values={values}
              setValues={setValues}
            />
          </div>

          <UpdateProductForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            loading={loading}
            icon={<SaveOutlined />}
            handleCategoryChange={handleCategoryChange}
            subCategories={subCategories}
            disableSubCategories={disableSubCategories}
            setValues={setValues}
            categories={categories}
            arrayOfSubCategories={arrayOfSubCategories}
            setArrayOfSubCategories={setArrayOfSubCategories}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
