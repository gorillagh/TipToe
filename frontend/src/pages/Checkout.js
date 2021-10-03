import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { emptyUserCart, getUserCart } from '../serverFunctions/user'

const Checkout = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log('User cart res ---->', JSON.stringify(res.data, null, 4))
      setProducts(res.data.products)
      setTotal(res.data.cartTotal)
    })
  }, [])

  const saveAddressToDB = () => {}

  const clearCart = () => {
    if (window.confirm('You are about to remove all the items in your cart')) {
      emptyUserCart(user.token).then((res) => {
        const cart = []
        if (res.data.success) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', cart)
          }
        }
        dispatch({
          type: 'ADD_TO_CART',
          payload: cart,
        })
        history.push('/')
      })
    } else {
      return
    }
  }
  return (
    <div className='container-fluid'>
      <h1>Checkout page</h1>

      <div className='row'>
        <div className='col-md-6'>
          <h4>Delivery Address</h4>
          <br />
          <br />
          textarea
          <button
            className='btn btn-primary mt-2 btn-raised btn-success'
            onClick={saveAddressToDB}
          >
            Save
          </button>
          <hr />
          <h4>Got Coupon?</h4>
          <br />
          coupuon input and apply button
        </div>
        <div className='col-md-6'>
          <h4>Order Summary</h4>
          <hr />
          <p>{products.length} Products</p>
          {products.length ? (
            products.map((product, i) => (
              <div key={i}>
                <small>
                  {product.product.title} x {product.count} ={' '}
                  {product.price * product.count}
                </small>
              </div>
            ))
          ) : (
            <p>No Products</p>
          )}
          <hr />
          <p>Total: GHS {total}</p>
          <div className='row'>
            <div className='col-md-6'>
              <button className='btn btn-primary btn-raised btn-success'>
                {' '}
                Place Order
              </button>
            </div>
            <div className='col-md-6'>
              <button
                onClick={clearCart}
                className='btn btn-primary btn-raised btn-success'
              >
                {' '}
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
