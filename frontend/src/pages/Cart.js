import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from 'antd'
import ProductCardInCheckout from '../components/Cards/ProductCardInCheckout'
import { saveToUserCart } from '../serverFunctions/user'

const Cart = ({ history }) => {
  const dispatch = useDispatch()
  const { user, cart } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [CODLoading, setCODLoading] = useState(false)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GHS',
  })

  const saveOrderToDb = () => {
    setLoading(true)
    dispatch({
      type: 'COD',
      payload: false,
    })
    localStorage.setItem('COD', 'false')
    saveToUserCart(cart, user.token)
      .then((res) => {
        setLoading(false)
        if (res.data.ok) {
          history.push('/checkout')
        } else {
          toast.error('Sorry a problem occured!')
          return
        }
      })
      .catch((err) => {
        setLoading(false)
        // console.log('Error', typeof err)
        if (err.message === 'Request failed with status code 401') {
          if (
            window.confirm(
              'Session expired! Click "Ok" to refresh your session.'
            )
          ) {
            window.location.reload()
          }
        }
      })
  }

  const saveCashOrderToDb = () => {
    setLoading(true)
    setCODLoading(true)
    dispatch({
      type: 'COD',
      payload: true,
    })
    localStorage.setItem('COD', 'true')
    saveToUserCart(cart, user.token)
      .then((res) => {
        setCODLoading(false)
        if (res.data.ok) {
          history.push('/checkout')
        } else {
          toast.error('Sorry a problem occured!')
          return
        }
      })
      .catch((err) => {
        setLoading(false)
        // console.log('Error--->', err.message)
        if (err.message === 'Request failed with status code 401') {
          if (
            window.confirm(
              'Session expired! Click "Ok" to refresh your session.'
            )
          ) {
            window.location.reload()
          }
        }
      })
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
                    <ProductCardInCheckout
                      loading={loading}
                      key={p._id}
                      p={p}
                    />
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
                <>
                  <Button
                    onClick={saveOrderToDb}
                    className='btn btn-raised btn-success btn-block btn-sm mt-2'
                    type='primary'
                    loading={loading}
                    disabled={CODLoading}
                  >
                    Checkout (Cashless)
                  </Button>

                  <Button
                    onClick={saveCashOrderToDb}
                    className='btn btn-raised btn-dark btn-block btn-sm mt-2'
                    type='primary'
                    loading={CODLoading}
                    disabled={loading}
                  >
                    Cash On Delivery
                  </Button>
                </>
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
