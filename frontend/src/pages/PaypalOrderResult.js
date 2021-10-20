import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { emptyUserCart } from '../serverFunctions/user'
import { verifyPaypalTransactionAndCreateOrder } from '../serverFunctions/paypal'

const PaypalOrderResult = ({ match }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  const [order, setOrder] = useState({ paymentIntent: {} })
  const [loading, setLoading] = useState(false)
  const [paymentSuccessful, setPaymentSuccessful] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (match.params.orderId) {
      verifyPaypalTransactionAndCreateOrder(
        match.params.orderId,
        user.token
      ).then((res) => {
        if (res.data.ok) {
          setOrder(res.data.newOrder)
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
          setPaymentSuccessful(true)
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <div className='container-fluid text-center'>
      {loading ? (
        <h4 className='text-danger'>Loading...</h4>
      ) : (
        <div>
          <h4>{paymentSuccessful ? 'Order Complete!' : 'Order Failed!'}</h4>

          <Card
            cover={
              <div>
                <img
                  style={{ width: '100px', height: '100px' }}
                  className='mb-1 img-fluid rounded mx-auto d-block'
                  src={
                    paymentSuccessful
                      ? 'https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/200/000000/external-check-banking-and-finance-kiranshastry-lineal-color-kiranshastry.png'
                      : 'https://img.icons8.com/color/48/000000/cancel--v1.png'
                  }
                />{' '}
                <p>
                  {' '}
                  {paymentSuccessful
                    ? 'Payment Successful!'
                    : 'Payment Failed!'}
                </p>
              </div>
            }
            actions={[
              <>
                <DollarOutlined className='text-info' />
                <br /> Total: $ {JSON.stringify(order.paymentIntent.amount)}
              </>,
            ]}
          />
          <p>
            {paymentSuccessful ? 'View this order in your ' : 'Go to '}
            <Link to='/user/history'>Order History</Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default PaypalOrderResult
