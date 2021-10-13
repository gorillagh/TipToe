import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Carousel } from 'react-responsive-carousel'
import StarRatings from 'react-star-ratings'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import ProductListItems from './ProductListItems'
import { Tabs } from 'antd'
import RatingModal from '../Modals/RatingModal'
import { showAverageRating } from '../rating'

const { TabPane } = Tabs

const SingleProduct = ({
  product,
  RatingChange,
  handleStarOk,
  handleStarCancel,
  loading,
  isModalVisible,
  setIsModalVisible,
  // productRating,
  star,
}) => {
  const { title, images, description, category, _id, quantity } = product
  const dispatch = useDispatch()
  const { user, cart } = useSelector((state) => ({ ...state }))
  const [tooltip, setTooltip] = useState('Click to add product')
  const handleAddToCart = () => {
    let cart = []
    //if there exist cart in local storage, get it
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.push({
        ...product,
        count: 1,
      })
      // remove duplicate products from cart
      const unique = _.uniqWith(cart, _.isEqual)
      //Save cart in local storage
      localStorage.setItem('cart', JSON.stringify(unique))

      setTooltip('Added!')

      //Dispatch to redux
      dispatch({
        type: 'ADD_TO_CART',
        payload: unique,
      })
      dispatch({
        type: 'SET_VISIBLE',
        payload: true,
      })
    }
  }

  return (
    <>
      <div className='col-md-7'>
        <div className='bg-dark'>
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((i) => (
                <img
                  alt='Product'
                  className='product-img'
                  src={i.url}
                  key={i.public_id}
                />
              ))}
          </Carousel>
        </div>

        {category && (
          <Tabs className='text-left' type='card' defaultActiveKey='1'>
            <TabPane tab='Description' key='1'>
              {description}
            </TabPane>
            <TabPane
              disabled={category.name === 'Game Discs'}
              tab='Specification'
              key='2'
            >
              More specifications...
            </TabPane>
          </Tabs>
        )}
      </div>

      <div className='col-md-5'>
        <h3 className='bg-info p-3'>{title}</h3>

        {product && product.ratings && product.ratings.length > 0 ? (
          showAverageRating(product, '1.25rem')
        ) : (
          <div className='text-center p-2'>Not Rated</div>
        )}

        {/* <div className='text-center'>
          <StarRatings
            className='text-center'
            name='rating'
            rating={productRating}
            numberOfStars={5}
            starRatedColor='red'
            starDimension='1.5625rem'
          />
        </div> */}

        <Card
          actions={[
            <Tooltip
              title={
                quantity < 1 ? 'Out of stock. Please Checkback soon' : tooltip
              }
              color={tooltip === 'Added!' && 'green'}
            >
              {quantity < 1 ? (
                <div>
                  <span disabled className='text-danger'>
                    Out of stock!
                  </span>
                  <br />
                  <small disabled>Please check back soon.</small>
                </div>
              ) : (
                <a onClick={handleAddToCart}>
                  <span className='text-danger'>
                    <ShoppingCartOutlined className='text-success' key='cart' />{' '}
                    <br /> Add to Cart
                  </span>
                </a>
              )}
            </Tooltip>,
            <Link to='/wishlist'>
              <HeartOutlined className='text-info' /> <br /> Add to wishlist
            </Link>,
            <RatingModal
              handleStarOk={handleStarOk}
              handleStarCancel={handleStarCancel}
              loading={loading}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            >
              <StarRatings
                className='text-center'
                name={_id}
                rating={star}
                numberOfStars={5}
                starRatedColor='red'
                starDimension='3.125rem'
                starHoverColor='black'
                changeRating={RatingChange}
                isSelectable={true}
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  )
}

export default SingleProduct
