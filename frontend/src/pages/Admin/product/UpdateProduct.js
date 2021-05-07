import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SaveOutlined, LoadingOutlined } from '@ant-design/icons'

import AdminNav from '../../../components/Navbar/AdminNav'
import { getProduct } from '../../../serverFunctions/product'
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

const UpdateProduct = ({ match }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [subCategories, setSubCategories] = useState([])
  const [disableSubCategories, setDisableCategories] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    setLoading(true)
    await getProduct(match.params.slug)
      .then((res) => {
        setLoading(false)
        console.log(res.data)
        setValues({ ...values, ...res.data })
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    //
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
          {JSON.stringify(values)}

          <UpdateProductForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            loading={loading}
            icon={<SaveOutlined />}
            setValues={setValues}
          />
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
