import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SaveOutlined } from '@ant-design/icons'
import AdminNav from '../../../components/Navbar/AdminNav'
import { createProduct } from '../../../serverFunctions/product'
import { toast } from 'react-toastify'
import CreateProductForm from '../../../components/Forms/CreateProductForm'
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
  categories: [],
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

const CreateProduct = () => {
  const { user } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [subCategories, setSubCategories] = useState([])
  const [disableSubCategories, setDisableCategories] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const Categories = await viewCategories()
    // console.log(Categories.data)
    setValues({ ...values, categories: Categories.data })
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleCategoryChange = (e) => {
    e.preventDefault()
    setValues({ ...values, subcategories: [], category: e.target.value })
    getSubCategories(e.target.value).then((res) => {
      setSubCategories(res.data)
      setDisableCategories(false)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    createProduct(user.token, values)
      .then((res) => {
        setLoading(false)
        window.alert(`"${res.data.title}" created successfully`)
        // toast.success(`"${res.data.title}" created successfully`)
        // document.getElementById('product-form').reset()
        window.location.reload()
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message)
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
          <h4 className='my-3 text-center'>Create Product</h4>
          <hr />
          <div className='p-3'>
            <FileUpload
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              values={values}
              setValues={setValues}
            />
          </div>

          <CreateProductForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            loading={loading}
            icon={<SaveOutlined />}
            handleCategoryChange={handleCategoryChange}
            subCategories={subCategories}
            disableSubCategories={disableSubCategories}
            setValues={setValues}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateProduct
