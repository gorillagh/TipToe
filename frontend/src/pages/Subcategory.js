import React, { useState, useEffect } from 'react'
import ProductCard from '../components/Cards/productCard'
import { viewSubCategory } from '../serverFunctions/subCategory'

const Subcategory = ({ match }) => {
  const [products, setProducts] = useState([])
  const [subcategory, setSubcategory] = useState({})
  const [loading, setLoading] = useState(false)
  const { slug } = match.params

  useEffect(() => {
    setLoading(true)
    viewSubCategory(slug).then((res) => {
      setLoading(false)
      setSubcategory(res.data.subcategory)
      setProducts(res.data.products)
    })
  }, [slug])

  return (
    <div>
      <div className='container'>
        <h4 className='text-center'>{subcategory.name}</h4>
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

export default Subcategory
