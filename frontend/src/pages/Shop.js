import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Slider, Checkbox, Radio } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import ProductCard from '../components/Cards/productCard'
import { fetchProductsByFilter, getProducts } from '../serverFunctions/product'
import { viewCategories } from '../serverFunctions/category'
import Star from '../components/Forms/Star'
import { viewSubCategories } from '../serverFunctions/subCategory'

const { SubMenu, ItemGroup } = Menu
const { Group } = Checkbox

const Shop = () => {
  const [pageLoading, setPageLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [price, setPrice] = useState([0, 0])
  const [priceOk, setPriceOk] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState([])
  const [star, setStar] = useState(0)
  const [subcategories, setSubcategories] = useState([])
  const [subcategory, setSubcategory] = useState('')
  const brands = [
    'Apple',
    'Samsung',
    'Microsoft',
    'Lenovo',
    'Asus',
    'Bose',
    'Sony',
    'Thrustmaster',
    'PlayStation',
    'Xbox',
  ]
  const [brand, setBrand] = useState('')
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue']
  const [color, setColor] = useState('')
  const shippings = ['Yes', 'No']
  const [shipping, setShipping] = useState('')

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

  const resetFilters = () => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar(0)
    setSubcategory('')
    setBrand('')
    setColor('')
    setShipping('')
    loadProducts()
  }

  // Load categories and subcategories
  useEffect(() => {
    getCategories()
    loadSubCategories()
  }, [])

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

  // 2. Text search query
  useEffect(() => {
    //Reset other filters to nothing
    setPrice([0, 0])
    setCategoryIds([])
    setStar(0)
    setSubcategory('')
    setBrand('')
    setColor('')
    setShipping('')
    //
    const delayed = setTimeout(() => {
      if (text === '') {
        loadProducts()
      } else {
        searchProductsByFilter({ query: text })
      }
    }, 300)
    return () => clearTimeout(delayed)
  }, [text])

  // 3. Category filter query
  const getCategories = () => {
    setPageLoading(true)
    viewCategories().then((res) => {
      setCategories(res.data)
      setPageLoading(false)
    })
  }
  const handleChecked = (e) => {
    //Reset other filters to nothinig
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setStar(0)
    setSubcategory('')
    setBrand('')
    setColor('')
    setShipping('')
    /////////////////////
    const inTheState = [...categoryIds]
    const justChecked = e.target.value
    const foundInTheState = inTheState.indexOf(justChecked)

    if (foundInTheState === -1) {
      inTheState.push(justChecked)
    } else {
      inTheState.splice(foundInTheState, 1)
    }
    setCategoryIds(inTheState)
    console.log(inTheState)

    if (!inTheState.length) {
      loadProducts()
    } else {
      searchProductsByFilter({ category: inTheState })
    }
  }

  // 4. Price filter query
  useEffect(() => {
    searchProductsByFilter({ price })
  }, [priceOk])

  const handlePriceChange = (value) => {
    //Reset other filters to nothinig
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setCategoryIds([])
    setStar(0)
    setSubcategory('')
    setBrand('')
    setColor('')
    setShipping('')
    /////////////////////
    setPrice(value)
    setTimeout(() => {
      setPriceOk(!priceOk)
    }, 300)
  }

  //5. Show products by star rating
  const handleStarClick = (num) => {
    //Reset other filters to nothinig
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setSubcategory('')
    setBrand('')
    setColor('')
    setShipping('')
    ////////////////////////////////
    setStar(num)
    searchProductsByFilter({ stars: num })
  }
  const showStars = () => (
    <div className='pr-4 pl-4 pb-2'>
      <Star starClick={handleStarClick} numberOfStars={5} starNoClick={star} />
      {/* <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} /> */}
    </div>
  )

  // 6. Show products by subcategories
  const loadSubCategories = () => {
    setPageLoading(true)
    viewSubCategories().then((res) => {
      setSubcategories(res.data)
      setPageLoading(false)
    })
  }

  const handleSubCategoryClick = (subcategory) => {
    //Reset other filters to nothinig
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar(0)
    setBrand('')
    setColor('')
    setShipping('')
    ////////////////////////////////
    setSubcategory(subcategory)
    searchProductsByFilter({ subcategory })
  }

  //7. Show products by brands
  const handleBrand = (e) => {
    //Reset other filters to nothing
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar(0)
    setSubcategory('')
    setColor('')
    setShipping('')
    /////////////////////////////////
    const brand = e.target.value
    setBrand(brand)
    searchProductsByFilter({ brand })
  }

  //8. Show products by Color
  const handleColor = (e) => {
    //Reset other filters to nothing
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar(0)
    setSubcategory('')
    setBrand('')
    setShipping('')
    ///////////////////////////////
    const color = e.target.value
    console.log(color)
    setColor(e.target.value)
    searchProductsByFilter({ color })
  }

  //9. Show products by shipping
  const handleShipping = (e) => {
    // Reset other filters to nothing
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar(0)
    setSubcategory('')
    setBrand('')
    setColor('')
    ////////////////////////////////
    const shipping = e.target.value
    setShipping(e.target.value)
    searchProductsByFilter({ shipping })
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-3 border-right'>
          <h4 className='p-3'>Filter Products</h4>
          <button
            onClick={resetFilters}
            className='btn btn-sm btn-primary float-right'
          >
            Reset Filters
          </button>
          <Menu defaultOpenKeys={['2']} mode='inline'>
            <SubMenu
              key='1'
              title={
                <span className='h6'>
                  <img
                    alt='category icon'
                    className='mr-2'
                    src='https://img.icons8.com/fluent/20/000000/category.png'
                  />{' '}
                  Categories
                </span>
              }
            >
              <div className='ml-3'>
                {categories &&
                  categories.length &&
                  categories.map((category) => {
                    return (
                      <div key={category._id}>
                        <Checkbox
                          className='pb-2 pl-4 pr-4'
                          name='category'
                          value={category._id}
                          onChange={handleChecked}
                          checked={categoryIds.includes(category._id)}
                        >
                          <small>{category.name}</small>
                        </Checkbox>
                      </div>
                    )
                  })}
              </div>
            </SubMenu>
            <SubMenu
              key='2'
              title={
                <span className='h6'>
                  <img
                    alt='Price Icon'
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
              key='3'
              title={
                <span className='h6'>
                  <img
                    alt='Star rating icon'
                    className='mr-2'
                    src='https://img.icons8.com/flat-round/20/000000/star--v1.png'
                  />{' '}
                  Rating
                </span>
              }
            >
              <div className='ml-3'>{showStars()}</div>
            </SubMenu>

            <SubMenu
              key='4'
              title={
                <span className='h6'>
                  <img
                    alt='subcategory icon'
                    className='mr-2'
                    src='https://img.icons8.com/fluency/20/000000/sorting-answers.png'
                  />{' '}
                  SubCategories
                </span>
              }
            >
              <div className='ml-3'>
                {subcategories &&
                  subcategories.length &&
                  subcategories.map((sub) => {
                    return (
                      <div
                        style={{
                          backgroundColor: sub === subcategory && 'green',
                          color: sub === subcategory && 'white',
                        }}
                        className='btn btn-secondary'
                        key={sub._id}
                        onClick={() => handleSubCategoryClick(sub)}
                      >
                        <small>{sub.name}</small>
                      </div>
                    )
                  })}
              </div>
            </SubMenu>

            <SubMenu
              key='5'
              title={
                <span className='h6'>
                  <img
                    alt='brands icon'
                    className='mr-2'
                    src='https://img.icons8.com/external-wanicon-two-tone-wanicon/20/000000/external-brand-business-model-canvas-wanicon-two-tone-wanicon.png'
                  />{' '}
                  Brands
                </span>
              }
            >
              <div className='ml-3'>
                {brands &&
                  brands.length &&
                  brands.map((b) => {
                    return (
                      <div key={brands.indexOf(b)}>
                        <Radio
                          value={b}
                          name={b}
                          onChange={handleBrand}
                          checked={b === brand}
                        >
                          <small>{b}</small>
                        </Radio>
                      </div>
                    )
                  })}
              </div>
            </SubMenu>

            <SubMenu
              key='6'
              title={
                <span className='h6'>
                  <img
                    alt='colors icon'
                    className='mr-2'
                    src='https://img.icons8.com/fluency/20/000000/color-dropper.png'
                  />{' '}
                  Colors
                </span>
              }
            >
              <div className='ml-3'>
                {colors &&
                  colors.length &&
                  colors.map((c) => {
                    return (
                      <div key={colors.indexOf(c)}>
                        <Radio
                          value={c}
                          name={c}
                          onChange={handleColor}
                          checked={c === color}
                        >
                          <small>{c}</small>
                        </Radio>
                      </div>
                    )
                  })}
              </div>
            </SubMenu>

            <SubMenu
              key='7'
              title={
                <span className='h6'>
                  <img
                    alt='Shipping icon'
                    className='mr-2'
                    src='https://img.icons8.com/dusk/20/000000/delivery--v1.png'
                  />{' '}
                  Shipping
                </span>
              }
            >
              <div className='ml-3'>
                {shippings &&
                  shippings.length &&
                  shippings.map((s) => {
                    return (
                      <div key={shippings.indexOf(s)}>
                        <Checkbox
                          className='pb-2 pl-4 pr-4'
                          value={s}
                          name='shipping'
                          name={s}
                          onChange={handleShipping}
                          checked={s === shipping}
                        >
                          <small>{s === 'Yes' ? 'Dilevery' : 'Pickup'}</small>
                        </Checkbox>
                      </div>
                    )
                  })}
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div className='col-md-9'>
          {pageLoading ? (
            <h1 className='text-center'>{<LoadingOutlined />}</h1>
          ) : (
            <div>
              <h4 className='text-center p-3'>Products</h4>

              <div className='row'>
                {products.length < 1 ? (
                  <p className='text-cetner'>Search ' {text} ' not found!</p>
                ) : (
                  products.map((product) => {
                    return (
                      <div key={product._id} className='col-md-4 mt-3'>
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
