import React, { useState, useEffect } from 'react'
import ProductCard from '../components/Cards/productCard'
import { viewCategory } from '../serverFunctions/category'

const Category = ({ match }) => {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState({})
  const [loading, setLoading] = useState(false)
  const { slug } = match.params

  useEffect(() => {
    setLoading(true)
    viewCategory(slug).then((res) => {
      setLoading(false)
      setCategory(res.data.category)
      setProducts(res.data.products)
    })
  }, [slug])

  return (
    <div>
      <div className='container'>
        <h4 className='text-center'>{category.name}</h4>
        <div className='row'>
          {loading ? (
            <h4 className='text-center text-danger'>Loading...</h4>
          ) : (
            products.map((product) => {
              return (
                <div key={product._id} className='col-md-4'>
                  {' '}
                  <ProductCard product={product} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Category
