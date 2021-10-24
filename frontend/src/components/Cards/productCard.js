import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import StarRatings from 'react-star-ratings'
import _ from 'lodash'
import { Card, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Picture from '../../images/favicon-32x32.png'
import { showAverageRating } from '../rating'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const { Meta } = Card
  const { title, images, description, slug, price, quantity } = product
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
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverageRating(product, '0.8rem')
      ) : (
        <div className='text-center p-2'>
          <StarRatings
            name='rating'
            rating={0}
            numberOfStars={5}
            starRatedColor='red'
            starDimension='0.8rem'
            isSelectable={false}
            starSpacing='0.13rem'
            editing={false}
          />
          <div>
            <small>Not Rated</small>
          </div>
        </div>
      )}

      {/* {product && product.ratings && product.ratings.length > 0 ? (
        showAverageRating(product, '0.8rem')
      ) : (
        <div className='text-center p-2'>Not Rated</div>
      )} */}
      <Card
        className='m-auto'
        hoverable
        style={{
          width: 230,
          borderRadius: '5% 5% 0 0',
          background: '#e1e5ea',
        }}
        cover={
          <Link to={`/product/${slug}`}>
            <div
              style={{
                height: 200,
                borderRadius: '5% 5% 0 0',
                objectFit: 'cover',
              }}
            >
              <img
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: '5% 5% 0 0',
                  objectFit: 'cover',
                }}
                alt='example'
                src={images && images.length ? images[0].url : Picture}
              />

              <h6 className='text-left ml-4 py-3'>
                Price: <span className='text-success'>GH¢ {price}</span>
              </h6>
            </div>
          </Link>
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <div>
              <span className='text-primary'>
                <EyeOutlined key='view' /> <br /> View
              </span>
            </div>
          </Link>,
          <Tooltip
            title={
              quantity < 1 ? 'Out of stock. Please Checkback soon' : tooltip
            }
            color={tooltip === 'Added!' && 'green'}
          >
            {quantity < 1 ? (
              <span className='text-danger'>Out of stock!</span>
            ) : (
              <p onClick={handleAddToCart}>
                <span className='text-danger'>
                  <ShoppingCartOutlined key='cart' /> <br /> Add to Cart
                </span>
              </p>
            )}
          </Tooltip>,
        ]}
      >
        <Link to={`/product/${slug}`}>
          {/* <div>
            {product && product.ratings && product.ratings.length > 0 ? (
              showAverageRating(product, '0.8rem')
            ) : (
              <div className='text-center p-2'>Not Rated</div>
            )}
          </div> */}
          <Meta
            style={{
              height: 110,
              marginTop: '25px',
              fontFamily: 'Ubuntu',
              fontWeight: 'normal',
            }}
            title={title}
            description={`${description && description.substring(0, 50)}...`}
          />
        </Link>
      </Card>
    </>
  )
}

export default ProductCard
