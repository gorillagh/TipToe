import React from 'react'

const ShowPaymentInfo = ({ order }) => {
  return (
    <div className='row text-left'>
      <div className='col-md-6'>
        <small>
          Ordered On:{' '}
          {order.paymentIntent.status === 'Cash On Delivery'
            ? new Date(order.paymentIntent.created).toLocaleString()
            : order.paymentIntent.status === 'successful'
            ? new Date(order.paymentIntent.created).toLocaleString()
            : order.paymentIntent.status === 'COMPLETED'
            ? new Date(order.paymentIntent.created).toLocaleString()
            : new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </small>
        <br />
        <small>Order Id: {order.paymentIntent.id}</small>
        <br />
        <small>
          Payment Method: {order.paymentIntent.payment_method_types[0]}
        </small>
      </div>

      <div className='col-md-6'>
        <small>
          Order Status:{' '}
          <span
            className={`badge text-white 
            ${
              order.orderStatus === 'Not Processed'
                ? 'badge-warning'
                : order.orderStatus === 'Cancelled'
                ? 'badge-danger'
                : order.orderStatus === 'Processing'
                ? 'badge-info'
                : order.orderStatus === 'Dispatched'
                ? 'badge-primary'
                : order.orderStatus === 'Completed'
                ? 'badge-success'
                : 'badge-dark'
            }`}
          >
            {order.orderStatus.toUpperCase()}
          </span>
          {/* </span>} */}
        </small>
        <br />
        <small>
          Payment Status: {order.paymentIntent.status.toUpperCase()}
        </small>
        <br />

        <small>
          Total Amount:{' '}
          <b>
            {order.paymentIntent.status === 'Cash On Delivery'
              ? order.paymentIntent.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              : order.paymentIntent.status === 'successful'
              ? order.paymentIntent.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              : order.paymentIntent.status === 'COMPLETED'
              ? order.paymentIntent.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              : (order.paymentIntent.amount / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
          </b>
        </small>
      </div>
    </div>
  )
}

export default ShowPaymentInfo
