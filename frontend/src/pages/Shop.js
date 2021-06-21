import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Slider, Checkbox } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import ProductCard from '../components/Cards/productCard'
import { fetchProductsByFilter, getProducts } from '../serverFunctions/product'
import { viewCategories } from '../serverFunctions/category'

const { SubMenu, ItemGroup } = Menu
const { Group } = Checkbox

const Shop = () => {
  const [pageLoading, setPageLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [price, setPrice] = useState([0, 0])
  const [priceOk, setPriceOk] = useState(false)
  const [categories, setCategories] = useState([])

  const dispatch = useDispatch()

  const { search } = useSelector((state) => ({ ...state }))
  const { text } = search

  const searchProductsByFilter = (arg) => {
    setPageLoading(true)
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data)
      setPageLoading(false)
    })
  }

  // 1. Load all products by default
  useEffect(() => {
    loadProducts()
    searchProductsByFilter({ query: text })
  }, [])
  const loadProducts = () => {
    setPageLoading(true)
    getProducts(100).then((res) => {
      setProducts(res.data)
      setPageLoading(false)
    })
  }

  useEffect(() => {
    getCategories()
  }, [])
  const getCategories = () => {
    setPageLoading(true)
    viewCategories().then((res) => {
      setCategories(res.data)
      setPageLoading(false)
    })
  }

  // 2. Text search query
  useEffect(() => {
    const delayed = setTimeout(() => {
      if (text === '') {
        loadProducts()
      } else {
        searchProductsByFilter({ query: text })
      }
    }, 300)
    return () => clearTimeout(delayed)
  }, [text])

  // 3. Price filter query
  useEffect(() => {
    searchProductsByFilter({ price })
  }, [priceOk])

  const handlePriceChange = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice(value)
    setTimeout(() => {
      setPriceOk(!priceOk)
    }, 300)
  }

  // 4. Category filter query
  function categoryChange(checkedValues) {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    searchProductsByFilter({ category: checkedValues })
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-3 border-right'>
          <h4>Filter</h4>

          <Menu defaultOpenKeys={[]} mode='inline'>
            <SubMenu
              key='1'
              title={
                <span className='h6'>
                  <img
                    className='mr-2'
                    src='https://img.icons8.com/doodle/20/000000/money.png'
                  />{' '}
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  range
                  className='ml-4 mr-4'
                  tipFormatter={(value) => `GH₵ ${value}`}
                  value={price}
                  onChange={handlePriceChange}
                  max='7999'
                />
              </div>
            </SubMenu>
            <SubMenu
              title={
                <span className='h6'>
                  <img
                    className='mr-2'
                    src='https://img.icons8.com/fluent/20/000000/category.png'
                  />{' '}
                  Categories
                </span>
              }
              key='2'
            >
              <div>
                <Group style={{ width: '100%' }} onChange={categoryChange}>
                  <div className='ml-3'>
                    {categories &&
                      categories.length &&
                      categories.map((category) => {
                        return (
                          <div key={category._id}>
                            <Checkbox value={category._id}>
                              {category.name}
                            </Checkbox>
                          </div>
                        )
                      })}
                  </div>
                </Group>
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className='col-md-9'>
          {pageLoading ? (
            <h1 className='text-center'>{<LoadingOutlined />}</h1>
          ) : (
            <div>
              <h4 className='text-center'>Products</h4>

              <div className='row'>
                {products.length < 1 ? (
                  <p className='text-cetner'>Search '{text}' not found!</p>
                ) : (
                  products.map((product) => {
                    return (
                      <div key={product._id} className='col-md-4'>
                        <ProductCard product={product} />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
