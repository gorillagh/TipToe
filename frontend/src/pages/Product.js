import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons'

import {
  getProduct,
  getRelatedProducts,
  updateProductRating,
} from '../serverFunctions/product'
import SingleProduct from '../components/Cards/SingleProduct'
import ProductCard from '../components/Cards/productCard'

const Product = ({ match }) => {
  const [product, setProduct] = useState({})
  const [relatedProducts, setRelatedProducts] = useState([])
  // const [productRating, setProductRating] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [star, setStar] = useState(0)
  const { _id } = product
  const { slug } = match.params

  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    setPageLoading(true)
    loadSingleProduct()
  }, [slug])

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      )
      existingRatingObject && setStar(existingRatingObject.star)
    }
  }, [product.ratings, user])

  // Load the product and its related products
  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data)
      //load related products
      getRelatedProducts(res.data._id).then((res) => {
        setRelatedProducts(res.data)
        setPageLoading(false)
      })
    })
  }

  const RatingChange = (newRating, name) => {
    setStar(newRating)
    console.log(newRating)
  }

  const handleStarOk = async () => {
    setLoading(true)
    const { email } = user
    const authtoken = user.token
    updateProductRating(star, _id, email, authtoken)
      .then((res) => {
        toast('Product rated successfully!')
        setIsModalVisible(false)
        setLoading(false)
        // loadProductRating()
        loadSingleProduct()
      })
      .catch((error) => {
        setLoading(false)
        toast.error('An Error occured please try again', error)
        setIsModalVisible(false)
      })
  }

  const handleStarCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className='container text-center m-auto'>
      {pageLoading ? (
        <LoadingOutlined />
      ) : (
        <div>
          <div className='container'>
            <div className='row pt-4'>
              <SingleProduct
                product={product}
                RatingChange={RatingChange}
                handleStarOk={handleStarOk}
                handleStarCancel={handleStarCancel}
                loading={loading}
                isModalVisible={isModalVisible}
                // productRating={productRating}
                star={star}
                setIsModalVisible={setIsModalVisible}
              />
            </div>
          </div>

          <div className='container mt-3'>
            <div className='bg-dark m-0 p-0'>
              <h4 className='text-center text-light p-3'>Related Products</h4>
            </div>

            <div className='row p-3'>
              {relatedProducts.length ? (
                relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct._id} className='col-md-4'>
                    <ProductCard product={relatedProduct} />
                  </div>
                ))
              ) : (
                <div className='text-center col-md'>No Related Products</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
