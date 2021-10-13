import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { createPaymentIntent } from '../serverFunctions/stripe'
import { Card } from 'antd'
import { DollarOutlined, CheckOutlined } from '@ant-design/icons'
import TipToe from '../images/favicon.ico'
import { createOrder, emptyUserCart } from '../serverFunctions/user'
import { flutterPayment } from '../serverFunctions/flutterwave'

const StripeCheckout = ({ history }) => {
  const dispatch = useDispatch()
  const { user, coupon } = useSelector((state) => ({ ...state }))

  const [succeeded, setSucceeded] = useState(false)
  const [hideSuccessIcon, setHideSuccessIcon] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')

  const [cartTotal, setCartTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [payable, setPayable] = useState(0)

  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    createPaymentIntent(coupon, user.token).then((res) => {
      console.log('Create payment intent=--->', res.data)
      setClientSecret(res.data.clientSecret)
      // additional response received on successful payment
      setCartTotal(res.data.cartTotal)
      setTotalAfterDiscount(res.data.totalAfterDiscount)
      setPayable(res.data.payable)
    })
  }, [])

  const handleFlutterwavePayment = async () => {
    flutterPayment(coupon, user.token).then((res) => {
      if (res.data.payment.status === 'success') {
        console.log(typeof res.data.payment.data.link)
        const url = res.data.payment.data.link.toString()
        window.location = url
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    })

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`)
      setProcessing(false)
    } else {
      //here you get result after successful payment
      //create order and save in database for admin to proccess
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          // empty cart from local storage
          if (typeof window !== 'undefined') localStorage.removeItem('cart')
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
          // empty cart from database
          emptyUserCart(user.token)
        }
      })
      //empty user cart from redux store and local storage
      console.log(JSON.stringify(payload, null, 4))
      setError(null)
      setProcessing(false)
      setSucceeded(true)
      setDisabled(true)
      setHideSuccessIcon(false)
    }
  }

  const handleChange = async (e) => {
    //listen for chnges in the card element
    //and display any errors as the customer types their card details
    setDisabled(e.error)
    setError(e.error ? e.error.message : '')
  }

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  return (
    <>
      {!succeeded ? (
        <div>
          <h5>Complete your purchase</h5>
          {coupon && totalAfterDiscount !== undefined ? (
            <p className='alert alert-success'>{`Total after discount: $${totalAfterDiscount}`}</p>
          ) : (
            <p className='alert alert-danger'>No Coupon Applied</p>
          )}
        </div>
      ) : (
        <h5>Payment Complete!</h5>
      )}
      <div className='text-center' hidden={hideSuccessIcon}>
        <img
          style={{ width: '100px', height: '100px' }}
          className='mb-1 img-fluid rounded mx-auto d-block'
          src='https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/200/000000/external-check-banking-and-finance-kiranshastry-lineal-color-kiranshastry.png'
        />
        <p>Payment Successful!</p>
      </div>
      <div className='text-center pb-5'>
        <Card
          // hidden={!succeeded}
          cover={
            <img
              hidden={!hideSuccessIcon}
              className='mb-1 img-fluid rounded mx-auto d-block'
              src={TipToe}
              style={{
                height: '100px',
                // objectFit: 'cover',
                width: '100px',
                marginBottom: '-50px',
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className='text-info' />
              <br /> Total: $ {cartTotal}
            </>,
            <>
              <CheckOutlined className='text-info' />
              <br /> Total Payable: $ {(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>
      <form
        hidden={!hideSuccessIcon}
        id='payment-form'
        className='stripe-form'
        onSubmit={handleSubmit}
      >
        <CardElement
          id='card-element'
          options={cardStyle}
          onChange={handleChange}
        />
        <button
          className='stripe-button'
          disabled={processing || disabled || succeeded}
        >
          <span id='button-text'>
            {processing ? <div className='spinner' id='spinner'></div> : 'pay'}
          </span>
        </button>
        <br />
        {error && (
          <div className='card-error text-danger' role='alert'>
            {error}
          </div>
        )}
        <br />
      </form>
      <p
        hidden={hideSuccessIcon}
        className={succeeded ? 'result-message' : 'result-message-hidden'}
      >
        Payment Successful.{' '}
        <Link to='/user/history'>See it in your purchase history.</Link>
      </p>

      <button
        hidden={true}
        className='btn btn-primary btn-raised'
        onClick={handleFlutterwavePayment}
      >
        Flutterwave payment
      </button>
    </>
  )
}

export default StripeCheckout
