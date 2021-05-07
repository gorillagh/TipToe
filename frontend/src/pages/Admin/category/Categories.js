import React from 'react'
import AdminNav from '../../../components/Navbar/AdminNav'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
  createCategory,
  viewCategories,
  deleteCategory,
} from '../../../serverFunctions/category'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import CategoryForm from '../../../components/Forms/CategoryForm'
import SearchFilter from '../../../components/Forms/SearchFilter'

const Categories = () => {
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState('')

  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const Categories = await viewCategories()
    // console.log(Categories.data)
    setCategories(Categories.data)
  }

  const removeCategory = async (slug) => {
    if (window.confirm(`Are you sure you want to delete "${slug}" category?`)) {
      await deleteCategory(user.token, slug)
        .then((res) => {
          toast.error(`"${res.data.Category.name}" category Deleted!`)
          loadCategories()
        })
        .catch((error) => {
          console.log(error)
          if (error.response.status === 400) {
            console.log(error)
            toast.error(error.response.data.message)
          }
        })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    //Add category to db categories
    await createCategory(user.token, newCategory)
      .then((res) => {
        setLoading(false)
        setNewCategory('')
        toast.success(`"${res.data.name}" Category was successfully created`)
        // console.log(res.data)
        loadCategories()
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        if (error.response.status === 400)
          toast.error(error.response.data.message)
      })
  }

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-6'>
          <h4 className='my-3 text-center'>Categories</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={newCategory}
            loading={loading}
            setName={setNewCategory}
            buttonIcon={<PlusOutlined />}
            buttonTitle='Add'
            placeholder='Enter category name'
          />
          <hr className='mt-5' />

          <SearchFilter keyword={keyword} setKeyword={setKeyword} />

          {categories.filter(searched(keyword)).map((category) => (
            <div className='alert alert-success' key={category._id}>
              {category.name}
              <span
                className='btn btn-sm btn-danger float-right mx-2'
                onClick={() => removeCategory(category.slug)}
              >
                <DeleteOutlined />
              </span>

              <Link to={`/category/update/${category.slug}`}>
                <span className='btn btn-sm btn-secondary float-right mx-2'>
                  <EditOutlined />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories
