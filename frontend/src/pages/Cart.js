import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductCardInCheckout from '../components/Cards/ProductCardInCheckout'
import { saveToUserCart } from '../serverFunctions/user'

const Cart = ({ history }) => {
  const dispatch = useDispatch()
  const { user, cart } = useSelector((state) => ({ ...state }))

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GHS',
  })

  const saveOrderToDb = () => {
    saveToUserCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          history.push('/checkout')
        } else {
          toast.error('Sorry a problem occured!')
          return
        }
      })
      .catch((err) => console.log('Error', err))
  }

  const getTotalPrice = () => {
    return formatter.format(
      cart.reduce((currentValue, nextValue) => {
        return currentValue + nextValue.price * nextValue.count
      }, 0)
    )
  }
  return (
    <div className='container-fluid pt-4'>
      <div className='row'>
        <div className='col-md-9'>
          {!cart.length ? (
            <div>
              <h4 className='text-center'>No Items In Cart</h4>
              <p>
                You have no items in your cart.{' '}
                <Link to='/shop'>Continue shopping...</Link>
              </p>
            </div>
          ) : (
            <div>
              <h4 className='text-left'>
                {cart.length} Item{'('}s{')'} In Cart{' '}
              </h4>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price(GHS)</th>
                    <th>Quantity</th>
                    <th>Color</th>
                    <th>Brand</th>
                    <th>Delivery</th>
                    <th>Remove</th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((p) => (
                    <ProductCardInCheckout key={p._id} p={p} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className='border-left col-md-3'>
          <h4 className='text-left'>Order Summary</h4>
          <hr />
          {cart.length < 1 ? (
            <p>
              You have no items on your order list.{' '}
              <Link to='/shop'>Continue shopping...</Link>
            </p>
          ) : (
            <div>
              <h5>Items</h5>
              {cart.map((c, i) => {
                return (
                  <div key={i}>
                    <small className=''>
                      {c.title} {'('}₵{c.price}
                      {')'} x {c.count} = ₵{c.price * c.count}
                    </small>
                    {/* <p className='text-right'>
                  ₵{c.price} x {c.count} = ₵{c.price * c.count}
                </p> */}
                  </div>
                )
              })}
              <hr />
              <p>
                Total = <b>{getTotalPrice()}</b>
              </p>
              <hr />
              {user && user.token ? (
                <button
                  onClick={saveOrderToDb}
                  className='btn btn-raised btn-success btn-block btn-sm mt-2'
                >
                  Checkout
                </button>
              ) : (
                <Link
                  to={{
                    pathname: '/login',
                    state: { from: 'cart' },
                  }}
                  className='btn btn-raised btn-success btn-block btn-sm mt-2'
                >
                  Login to Checkout
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart