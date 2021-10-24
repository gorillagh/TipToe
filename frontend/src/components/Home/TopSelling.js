import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pagination } from 'antd'
import { CrownFilled } from '@ant-design/icons'

import {
  getProductList,
  getProductsTotalNumber,
} from '../../serverFunctions/product'
import ProductCard from '../Cards/productCard'
import LoadingSkeleton from '../Cards/LoadingSkeleton'

const TopSelling = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [cleanState, setCleanState] = useState({})
  const [productsCount, setProductsCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const numberPerPage = 4

  useEffect(() => {
    loadProducts()
    return () => {
      setCleanState({})
    }
  }, [pageNumber, cleanState])

  useEffect(() => {
    getProductsTotalNumber().then((res) => {
      setProductsCount(res.data)
    })
    return () => {
      setCleanState({})
    }
  }, [])

  const loadProducts = () => {
    setLoading(true)
    getProductList('sold', 'desc', pageNumber, numberPerPage)
      .then((res) => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <div>
      <div className='container-fluid m-0'>
        <h4
          style={{ background: '#183153', color: '#FAB005' }}
          className='text-center  jumbotron p-2 m-0'
        >
          Top Selling <CrownFilled />
        </h4>
      </div>

      <div className='container pb-0 border'>
        {loading ? (
          <div>
            <LoadingSkeleton count={3} />
          </div>
        ) : (
          <div className='row d-flex d-flex justify-content-center mt-3'>
            {products.map((product) => (
              <div key={product._id} className='col-md-3 col-lg-3 p-2'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className='mt-3 text-center'>
          <Pagination
            current={pageNumber}
            total={(productsCount / numberPerPage) * 10}
            defaultCurrent={1}
            onChange={(value) => setPageNumber(value)}
          />
        </div>

        <div className='mt-3'>
          <Link
            to='/'
            style={{ background: '#339AF0' }}
            className='text-center d-block text-white text-underlined jumbotron  p-2'
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TopSelling
