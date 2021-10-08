import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import {
  applyDiscount,
  emptyUserCart,
  getUserCart,
  saveAddressToDb,
} from '../serverFunctions/user'

const Checkout = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [coupon, setCoupon] = useState('')
  const [addressedSaved, setaddressedSaved] = useState(false)
  const [discount, setDiscount] = useState('')
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      // console.log('User cart res ---->', JSON.stringify(res.data, null, 4))
      setProducts(res.data.products)
      setTotal(res.data.cartTotal)
    })
  }, [])

  const saveAddress = async () => {
    console.log('Address--->', address, address.length)

    if (address !== '') {
      saveAddressToDb(address, user.token).then((res) => {
        if (res.data.ok) {
          setaddressedSaved(true)
          toast.success('Addressed saved!')
        }
      })
    } else {
      toast.error('Please provide a valid address')
      return
    }
  }

  const applyCoupon = () => {
    console.log('Send coupon to backend', coupon)
    applyDiscount(coupon, user.token).then((res) => {
      console.log(('Res on coupon applied===>', res.data))
      if (res.data) {
        setTotalAfterDiscount(res.data.totalAfterDiscount)
        setDiscount(res.data.discount)
        //push the totalAfterDiscount to redux
        dispatch({
          type: 'COUPON_APPLIED',
          payload: true,
        })
      }
      if (res.data.err) {
        setDiscountError(res.data.err)
        //update redux coupon applied
        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        })
      }
    })
  }

  const clearCart = () => {
    if (window.confirm('You are about to remove all the items in your cart')) {
      //remove from backend
      emptyUserCart(user.token).then((res) => {
        if (res.data.success) {
          //remove from state
          setProducts([])
          setTotal(0)
          setTotalAfterDiscount(0)
          setCoupon('')
          //remove from local storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart')
          }
          toast('Your basket is empty. Continue shopping')
        }
        //remove from redux
        dispatch({
          type: 'ADD_TO_CART',
          payload: [],
        })
        history.push('/')
      })
    } else {
      return
    }
  }

  return (
    <div className='container-fluid '>
      <h4 className='text-center'>Checkout</h4>

      <div className='row'>
        <div className='col-md-6 px-5 py-3'>
          <h5>Please provide your delivery Address</h5>
          <ReactQuill theme='snow' value={address} onChange={setAddress} />
          <button
            className='btn btn-primary mt-2 btn-raised'
            onClick={saveAddress}
          >
            Save
          </button>
          <hr />
          <h4>Got Coupon?</h4>
          <div className='row'>
            <div className='col-md-10'>
              <input
                className='form-control'
                type='text'
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value)
                  setDiscountError('')
                }}
              />
            </div>
            <div className='col-md-2'>
              <button
                onClick={applyCoupon}
                className='btn btn-raised btn-primary btn-block'
              >
                Apply
              </button>
            </div>
            {discountError && (
              <p className='text-center w-100 my-3 bg-danger'>
                Invalid Coupon!
              </p>
            )}
          </div>
        </div>
        <div className='col-md-6 px-4 py-3'>
          <h5>Order Summary</h5>
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
          {totalAfterDiscount > 0 && (
            <p className='p-2'>
              {discount}% Discount Applied = <strike>GHS {total}</strike> ={' '}
              <strong>GHS {totalAfterDiscount}</strong>
            </p>
          )}

          <div className='row'>
            <div className='col-md-6'>
              <button
                onClick={() => history.push('/payment')}
                disabled={!products.length || !addressedSaved}
                className='btn btn-primary btn-raised btn-success'
              >
                Place Order
              </button>
            </div>
            <div className='col-md-6'>
              <button
                disabled={!products.length}
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
