import React from 'react'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import ShowPaymentInfo from '../Cards/ShowPaymentInfo'

const Orders = ({ orders, handleStatusChange }) => {
  const showOrderInTable = (order) => {
    return (
      <table className='table table-bordered'>
        <thead className='thead-dark'>
          <tr>
            <th scope='col'>
              <small>
                <b>Product</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Price</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Brand</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Color</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Quantity</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Shipping</b>
              </small>
            </th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => {
            return (
              <tr key={i}>
                <td>
                  <small>
                    <b>{p.product.title} </b>
                  </small>
                </td>
                <td>
                  <small>$ {p.product.price}</small>
                </td>
                <td>
                  <small>{p.product.brand}</small>
                </td>
                <td>
                  <small>{p.color}</small>
                </td>
                <td>
                  <small>{p.count}</small>
                </td>
                <td>
                  <small>
                    {p.product.shipping === 'Yes' ? (
                      <CheckCircleOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: 'red' }} />
                    )}
                  </small>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      {orders.map((order) => {
        return (
          <div key={order._id} className='card m-4 p-3'>
            <div className='row '>
              <div className='col-md-8'>
                <ShowPaymentInfo order={order} />
              </div>

              <div className='row'>
                <div className='col-md-5'>Status</div>
                <div className='col-md-7'>
                  <select
                    name='status'
                    className='form-control'
                    defaultValue={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value='Cancelled'>Cancelled</option>

                    <option value='Not Processed'>Not Processed</option>
                    <option value='Processing'>Processing</option>
                    <option value='Dispatched'>Dispatched</option>
                    <option value='Completed'>Completed</option>
                  </select>
                </div>
              </div>
            </div>
            {showOrderInTable(order)}
          </div>
        )
      })}
    </div>
  )
}

export default Orders
