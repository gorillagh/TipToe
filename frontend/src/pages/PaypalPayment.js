import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { Card, Button } from 'antd'
import { DollarOutlined, CheckOutlined } from '@ant-design/icons'
import { FUNDING } from '@paypal/react-paypal-js'
import { createPaypalIntent } from '../serverFunctions/paypal'
import TipToe from '../images/favicon.ico'
import { paystackPayment } from '../serverFunctions/paystack'

const PayPalButton = window.paypal.Buttons.driver('react', { React, ReactDOM })

const PaypalPayment = ({ history, match }) => {
  const { user, coupon } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [error, setError] = useState(null)

  const [url, setUrl] = useState('')

  const [cartTotal, setCartTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [payable, setPayable] = useState(0)

  useEffect(() => {
    setLoading(true)
    console.log(match.params.slug)
    if (match.params.slug === 'paypal') {
      createPaypalTransaction()
    }
    if (match.params.slug === 'paystack') {
      createPaystackTransaction()
    }
  }, [])
  const createPaypalTransaction = () => {
    createPaypalIntent(coupon, user.token).then((res) => {
      setCartTotal(res.data.cartTotal)
      setTotalAfterDiscount(res.data.totalAfterDiscount)
      setPayable(res.data.payable)
      setLoading(false)
    })
  }
  const createPaystackTransaction = () => {
    paystackPayment(coupon, user.token).then((res) => {
      setUrl(res.data.transaction.data.authorization_url)
      setCartTotal(res.data.cartTotal)
      setTotalAfterDiscount(res.data.totalAfterDiscount)
      setPayable(res.data.payable)
      setLoading(false)
    })
  }

  function myComp() {
    const createOrder = (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: `${payable}`,
            },
          },
        ],
      })
    }

    const onApprove = (data, actions) => {
      return actions.order.capture()
    }

    return (
      <PayPalButton
        style={{ color: 'blue', shape: 'pill', label: 'pay', height: 40 }}
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => {
          onApprove(data, actions).then((details) =>
            history.push(`/paypal/order/result/${details.id}`)
          )
        }}
        onCancel={() => setCancel(true)}
        onError={() => setError(true)}
        fundingSource={FUNDING.PAYPAL}
      />
    )
  }

  return (
    <div className='container p-5 text-center'>
      <div className='col-md-8 offset-md-2'>
        {loading ? (
          <h4 className='text-danger'>Loading...</h4>
        ) : (
          <div>
            <h5>Complete your purchase</h5>
            {coupon && totalAfterDiscount !== undefined ? (
              <p className='alert alert-success'>{`Total after discount: $${totalAfterDiscount}`}</p>
            ) : (
              <p className='alert alert-danger'>No Coupon Applied</p>
            )}
          </div>
        )}
        {!loading && (
          <Card
            cover={
              <img
                alt=''
                className='mb-1 img-fluid rounded mx-auto d-block'
                src={TipToe}
                style={{
                  height: '100px',
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
                <br /> Total Payable: ${' '}
                {url ? (payable / 100).toFixed(2) : payable.toFixed(2)}
              </>,
            ]}
          />
        )}

        {!cancel && !url && !loading && myComp()}
        {cancel && (
          <div className='text-danger'>
            Order Cancelled. <a href=''>Try Again</a>
          </div>
        )}
        {error && (
          <div className='text-danger'>
            An Error occured. <a href=''>Try Again</a>
          </div>
        )}
        {url && !loading && (
          <Button
            onClick={() => (window.location = url)}
            className='btn btn-block btn-primary btn-raised'
          >
            Paystack Checkout
          </Button>
        )}
      </div>
    </div>
  )
}

export default PaypalPayment
