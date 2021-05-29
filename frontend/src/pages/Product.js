import React, { useEffect, useState } from 'react'
import { getProduct } from '../serverFunctions/product'
import SingleProduct from '../components/Cards/SingleProduct'

const Product = ({ match }) => {
  const [product, setProduct] = useState({})
  const { slug } = match.params

  useEffect(() => {
    loadSingleProduct()
  }, [slug])

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => setProduct(res.data))
  }

  return (
    <div className='container'>
      <div className='row pt-4'>
        <SingleProduct product={product} />
      </div>

      <div className='row'>
        <div>Related Products</div>
      </div>
    </div>
  )
}

export default Product
