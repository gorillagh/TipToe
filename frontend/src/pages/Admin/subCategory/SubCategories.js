import React from 'react'
import AdminNav from '../../../components/Navbar/AdminNav'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Select } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { viewCategories } from '../../../serverFunctions/category'
import {
  viewSubCategories,
  deleteSubCategory,
  createSubCategory,
} from '../../../serverFunctions/subCategory'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import CategoryForm from '../../../components/Forms/CategoryForm'
import SearchFilter from '../../../components/Forms/SearchFilter'

const SubCategories = () => {
  const [newSubCategory, setNewSubCategory] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])

  const [keyword, setKeyword] = useState('')

  const { user } = useSelector((state) => ({ ...state }))

  //load and search categories
  const { Option } = Select
  function onChange(value) {
    setCategory(value)
    console.log(`selected ${value}`)
  }
  // function onBlur() {
  //   console.log('blur')
  // }
  // function onFocus() {
  //   console.log('focus')
  // }
  // function onSearch(val) {
  //   console.log('search:', val)
  // }
  //////////////////////////////

  useEffect(() => {
    loadCategories()
    loadSubCategories()
  }, [])

  const loadCategories = async () => {
    const Categories = await viewCategories()
    // console.log(Categories.data)
    setCategories(Categories.data)
  }
  const loadSubCategories = async () => {
    const SubCategories = await viewSubCategories()
    // console.log(Categories.data)
    setSubCategories(SubCategories.data)
  }

  const removeSubCategory = async (slug) => {
    if (window.confirm(`Are you sure you want to delete "${slug}" category?`)) {
      await deleteSubCategory(user.token, slug)
        .then((res) => {
          toast.error(`"${res.data.SubCategory.name}" subcategory Deleted!`)
          loadSubCategories()
        })
        .catch((error) => {
          console.log(error)
          if (error.response.status === 403) {
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
    await createSubCategory(user.token, newSubCategory, category)
      .then((res) => {
        setLoading(false)
        setNewSubCategory('')
        toast.success(`"${res.data.name}" subcategory was successfully created`)
        // console.log(res.data)
        loadSubCategories()
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
          <h4 className='my-3 text-center'>Subcategories</h4>
          <div className='row'>
            <div className='col-md-6 mt-3'>
              <Select
                showSearch
                style={{ width: 300 }}
                size='large'
                placeholder='Select parent category'
                optionFilterProp='children'
                onChange={onChange}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {categories.length &&
                  categories.map((c) => <Option key={c._id}>{c.name}</Option>)}
              </Select>
            </div>

            <div className='col-md-6'>
              <CategoryForm
                handleSubmit={handleSubmit}
                name={newSubCategory}
                loading={loading}
                setName={setNewSubCategory}
                buttonIcon={<PlusOutlined />}
                buttonTitle='Add'
                placeholder='Enter subcategory name'
              />
            </div>
          </div>

          <hr className='mt-3' />

          <SearchFilter keyword={keyword} setKeyword={setKeyword} />

          {subCategories.filter(searched(keyword)).map((subcategory) => (
            <div className='alert alert-success' key={subcategory._id}>
              {subcategory.name}
              <span
                className='btn btn-sm btn-danger float-right mx-2'
                onClick={() => removeSubCategory(subcategory.slug)}
              >
                <DeleteOutlined />
              </span>

              <Link to={`/subcategory/update/${subcategory.slug}`}>
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

export default SubCategories
