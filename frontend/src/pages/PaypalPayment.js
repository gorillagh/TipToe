import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import { DollarOutlined, CheckOutlined } from '@ant-design/icons'
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from '@paypal/react-paypal-js'
import { createPaypalIntent } from '../serverFunctions/paypal'
import { createOrder, emptyUserCart } from '../serverFunctions/user'
import TipToe from '../images/favicon.ico'

const PayPalButton = window.paypal.Buttons.driver('react', { React, ReactDOM })

const PaypalPayment = ({ history }) => {
  const dispatch = useDispatch()
  const { user, coupon } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [hideSuccessIcon, setHideSuccessIcon] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [intentCreated, setIntentCreated] = useState({})
  const [orderId, setOrderId] = useState('')

  const [cartTotal, setCartTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [payable, setPayable] = useState(0)

  useEffect(() => {
    createPaypalTransaction()
  }, [])
  const createPaypalTransaction = () => {
    setLoading(true)
    createPaypalIntent(coupon, user.token).then((res) => {
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
        <Card
          cover={
            <img
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
              <br /> Total Payable: $ {payable.toFixed(2)}
            </>,
          ]}
        />
        {/* <PayPalScriptProvider
          options={{
            'client-id':
              'AQC2VYggyNxfGtT-_4aLrmt64x07sRGWN_ciFhM0XgrGJH0vsyMbX5Tdqt41GpAhFifv9Te-DGbd-dyl',
          }}
        >
          <PayPalButtons
            style={{ color: 'blue', shape: 'pill', label: 'pay', height: 40 }}
            fundingSource={FUNDING.PAYPAL}
            createOrder={createOrder()}
            onClick={captureOrder}
          />
        </PayPalScriptProvider> */}
        {!cancel && myComp()}
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
      </div>
    </div>
  )
}

export default PaypalPayment
