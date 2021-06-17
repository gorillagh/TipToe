import React, { useEffect, useState } from 'react'
import { useSelector, useDipatch } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import ProductCard from '../components/Cards/productCard'
import { getProducts } from '../serverFunctions/product'

const Shop = () => {
  const [pageLoading, setPageLoading] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setPageLoading(true)
    getProducts(100).then((res) => {
      setProducts(res.data)
      setPageLoading(false)
    })
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-3 border-right'>Search Filters</div>
        <div className='col-md-9'>
          {pageLoading ? (
            <h1 className='text-center'>{<LoadingOutlined />}</h1>
          ) : (
            <div>
              <h4 className='text-center'>Products</h4>

              <div className='row'>
                {products.length < 0 ? (
                  <p className='text-cetner'>No Products Found.</p>
                ) : (
                  products.map((product) => {
                    return (
                      <div className='col-md-4'>
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
