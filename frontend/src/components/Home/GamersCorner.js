import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductsBycategory } from '../../serverFunctions/product'
import ProductCard from '../Cards/productCard'
import LoadingSkeleton from '../Cards/LoadingSkeleton'

const GamersCorner = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [cleanState, setCleanState] = useState({})

  useEffect(() => {
    loadProducts()
    return () => {
      setCleanState({})
    }
  }, [])

  const loadProducts = () => {
    setLoading(true)
    getProductsBycategory(
      'createdAt',
      'desc',
      ['6080b24254d1a62030b0ab51', '6080392e54d1a62030b0ab4e'],
      4
    )
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
          style={{ background: '#FFA500' }}
          className='text-center  jumbotron p-2 m-0'
        >
          Gamers' Corner <i className='fas fa-gamepad'></i>
        </h4>
      </div>

      <div className='container pb-0 border'>
        {loading ? (
          <div>
            <LoadingSkeleton count={3} />
          </div>
        ) : (
          <div className='row mt-3'>
            {products.map((product) => (
              <div key={product._id} className='col-md-4 col-lg-3 p-2'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        <div className='mt-3'>
          <Link
            to='/'
            className='text-center d-block text-white text-underlined jumbotron bg-success p-2'
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GamersCorner
