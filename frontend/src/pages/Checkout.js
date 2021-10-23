import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import { Button } from 'antd'
import 'react-quill/dist/quill.snow.css'

import {
  applyDiscount,
  emptyUserCart,
  getUserCart,
  saveAddressToDb,
  cashOrder,
} from '../serverFunctions/user'
import { flutterPayment } from '../serverFunctions/flutterwave'

const Checkout = ({ history }) => {
  const { user, COD, coupon } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [coupontoApply, setCouponToApply] = useState('')
  const [couponButtonLoading, setCouponButtonLoading] = useState(false)
  const [addressedSaved, setaddressedSaved] = useState(false)
  const [discount, setDiscount] = useState('')
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  let localStorageCOD = ''
  if (typeof window !== 'undefined') {
    localStorageCOD = localStorage.getItem('COD')
  }
  // console.log('COD------->', localStorageCOD)

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      // console.log('User cart res ---->', JSON.stringify(res.data, null, 4))
      setProducts(res.data.products)
      setTotal(res.data.cartTotal)
    })
  }, [])

  const saveAddress = async () => {
    setSaveButtonLoading(true)
    console.log('Address--->', address, address.length)

    if (address !== '') {
      saveAddressToDb(address, user.token).then((res) => {
        if (res.data.ok) {
          setaddressedSaved(true)
          setSaveButtonLoading(false)
          toast.success('Addressed saved!')
        }
      })
    } else {
      setSaveButtonLoading(false)
      toast.error('Please provide a valid address')
      return
    }
  }

  const applyCoupon = () => {
    setCouponButtonLoading(true)
    console.log('Send coupon to backend', coupontoApply)
    applyDiscount(coupontoApply, user.token).then((res) => {
      console.log(('Res on coupon applied===>', res.data))
      if (res.data) {
        setCouponButtonLoading(false)
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
          setCouponToApply('')
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

  const createCODOrder = () => {
    if (window.confirm('Order and pay cash on delivery!')) {
      cashOrder(localStorageCOD, coupon, user.token).then((res) => {
        console.log(res.data)

        if (res.data.ok) {
          // empty cart from local storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart')
            localStorage.removeItem('COD')
          }
          // empty cart from redux
          dispatch({
            type: 'ADD_TO_CART',
            payload: [],
          })
          //reset coupon to false
          dispatch({
            type: 'COUPON_APPLIED',
            payload: false,
          })
          dispatch({
            type: 'COD',
            payload: false,
          })
          // empty cart from database
          emptyUserCart(user.token)
          setLoading(false)
          setTimeout(() => {
            history.push('/user/history')
          }, 1000)
        }
      })
    }
  }

  const handleFlutterwavePayment = async () => {
    setLoading(true)
    flutterPayment(coupon, user.token).then((res) => {
      if (res.data.payment.status === 'success') {
        const url = res.data.payment.data.link.toString()

        window.location = url
        // setLoading(false)
      }
    })
  }

  return (
    <div className='container-fluid '>
      <h4 className='text-center'>Checkout</h4>

      <div className='row'>
        <div className='col-md-6 px-5 py-3'>
          <h5>Please provide your delivery Address</h5>
          <ReactQuill
            theme='snow'
            disabled={loading}
            value={address}
            onChange={setAddress}
          />

          <div className='text-right'>
            <Button
              disabled={loading}
              className='btn mt-2 btn-raised'
              onClick={saveAddress}
              type='primary'
              loading={saveButtonLoading}
              icon={!saveButtonLoading && <i className='mr-1 far fa-save'></i>}
            >
              Save
            </Button>
          </div>

          <hr />
          <h5>Got Coupon?</h5>

          <input
            disabled={loading}
            className='form-control'
            type='text'
            value={coupontoApply}
            onChange={(e) => {
              setCouponToApply(e.target.value)
              setDiscountError('')
            }}
          />

          <div className='text-right'>
            <Button
              disabled={loading}
              className='btn mt-2 btn-raised'
              onClick={applyCoupon}
              type='primary'
              loading={couponButtonLoading}
              icon={
                !couponButtonLoading && (
                  <i className='fas mr-1 fa-percentage'></i>
                )
              }
            >
              Apply
            </Button>
          </div>

          {discountError && (
            <p className='text-center w-100 my-3 bg-danger'>Invalid Coupon!</p>
          )}
        </div>
        <div className='col-md-6 px-5 py-3'>
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
              {localStorageCOD === 'true' ? (
                <Button
                  loading={loading}
                  onClick={createCODOrder}
                  disabled={!products.length || !addressedSaved}
                  className='btn btn-primary btn-raised btn-success'
                >
                  Place Order (Cash)
                </Button>
              ) : (
                <Button
                  // onClick={() => history.push('/payment')}
                  loading={loading}
                  onClick={handleFlutterwavePayment}
                  disabled={!products.length || !addressedSaved}
                  className='btn btn-primary btn-raised btn-success'
                >
                  Place Order (Card/MoMo)
                </Button>
              )}
            </div>
            <div className='col-md-6'>
              <button
                disabled={!products.length || loading}
                onClick={clearCart}
                className='btn btn-primary btn-raised btn-success'
              >
                {' '}
                Empty Cart
              </button>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <Button
                hidden={localStorageCOD === 'true'}
                loading={loading}
                onClick={() => history.push('/paypal-payment/paypal')}
                disabled={!products.length || !addressedSaved}
                className='btn btn-primary btn-raised btn-success'
              >
                Pay With Paypal
              </Button>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <Button
                hidden={localStorageCOD === 'true'}
                loading={loading}
                onClick={() => history.push('/paypal-payment/paystack')}
                disabled={!products.length || !addressedSaved}
                className='btn btn-primary btn-raised btn-success'
              >
                Paystack Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
