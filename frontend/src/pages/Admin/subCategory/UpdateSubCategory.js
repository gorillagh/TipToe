import React, { useCallback } from 'react'
import AdminNav from '../../../components/Navbar/AdminNav'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SaveOutlined } from '@ant-design/icons'
import { viewCategories } from '../../../serverFunctions/category'
import {
  viewSubCategory,
  updateSubCategory,
} from '../../../serverFunctions/subCategory'

import { toast } from 'react-toastify'
import CategoryForm from '../../../components/Forms/CategoryForm'

const UpdateSubCategory = ({ history, match }) => {
  const [oldName, setOldName] = useState('')
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])
  const [parent, setParent] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => ({ ...state }))

  const loadSubCategory = useCallback(async () => {
    const result = await viewSubCategory(match.params.slug)
    setName(result.data.subcategory.name)
    setOldName(result.data.subcategory.name)
    setParent(result.data.subcategory.parent)
  }, [match.params.slug])

  const loadCategories = async () => {
    const Categories = await viewCategories()
    // console.log(Categories.data)
    setCategories(Categories.data)
  }

  useEffect(() => {
    loadSubCategory()
    loadCategories()
  }, [loadSubCategory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    //Add category to db categories
    await updateSubCategory(user.token, match.params.slug, name, parent)
      .then((res) => {
        setLoading(false)
        toast.success(
          `Category Update: "${oldName}" updated to "${res.data.name}"`
        )

        history.push('/admin/subcategories')
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        if (error.response.status === 403)
          toast.error(error.response.data.message)
      })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-6'>
          <h4 className='my-3 text-center'>Subcategories</h4>
          <div className='row'>
            <div className='col-md-6 mt-3'>
              <select
                className='custom-select'
                name='category'
                onChange={(e) => setParent(e.target.value)}
              >
                {categories.length &&
                  categories.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      selected={c._id === parent}
                    >
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className='col-md-6'>
              <CategoryForm
                handleSubmit={handleSubmit}
                name={name}
                loading={loading}
                setName={setName}
                buttonIcon={<SaveOutlined />}
                buttonTitle='Save'
                placeholder='Enter subcategory name'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateSubCategory
