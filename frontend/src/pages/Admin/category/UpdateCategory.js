import React, { useCallback } from 'react'
import AdminNav from '../../../components/Navbar/AdminNav'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SaveOutlined } from '@ant-design/icons'

import { viewCategory, updateCategory } from '../../../serverFunctions/category'
import { toast } from 'react-toastify'
import CategoryForm from '../../../components/Forms/CategoryForm'

const UpdateCategory = ({ history, match }) => {
  const [oldName, setOldName] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state) => ({ ...state }))

  const loadCategory = useCallback(async () => {
    const result = await viewCategory(match.params.slug)
    setName(result.data.category.name)
    setOldName(result.data.category.name)
  }, [match.params.slug])

  useEffect(() => {
    loadCategory()
  }, [loadCategory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    //Add category to db categories
    await updateCategory(user.token, match.params.slug, name)
      .then((res) => {
        setLoading(false)
        toast.success(
          `Category Update: "${oldName}" updated to "${res.data.name}"`
        )

        history.push('/admin/categories')
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
          <h4 className='my-3'>Update Category</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            loading={loading}
            setName={setName}
            buttonIcon={<SaveOutlined />}
            buttonTitle='Save'
            placeholder='Enter category name'
          />
        </div>
      </div>
    </div>
  )
}

export default UpdateCategory
