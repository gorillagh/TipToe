import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import {
  getProduct,
  // getProductAverageRating,
  updateProductRating,
} from '../serverFunctions/product'
import SingleProduct from '../components/Cards/SingleProduct'

const Product = ({ match }) => {
  const [product, setProduct] = useState({})
  // const [productRating, setProductRating] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [star, setStar] = useState(0)
  const { _id } = product
  const { slug } = match.params

  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
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

  // useEffect(() => {
  //   loadProductRating()
  // }, [_id])

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => setProduct(res.data))
  }

  // const loadProductRating = () => {
  //   _id &&
  //     getProductAverageRating(_id).then((res) => {
  //       if (res.data) {
  //         setProductRating(res.data)
  //       } else {
  //         setProductRating(0)
  //       }
  //     })
  // }

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
    <>
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
        <h4 className='text-center'>Related Products</h4>
      </div>
    </>
  )
}

export default Product
