import React from 'react'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import ShowPaymentInfo from '../Cards/ShowPaymentInfo'

const Orders = ({ orders, handleStatusChange }) => {
  return (
    <div>
      {orders.map((order) => {
        return (
          <div key={order._id} className='row pb-5'>
            <div className='col-md-8'>
              <ShowPaymentInfo order={order} />
            </div>

            <div className='row'>
              <div className='col-md-4'>Status</div>
              <div className='col-md-8'>
                <select
                  name='status'
                  className='form-control'
                  defaultValue={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value='Not Processed'>Not Processed</option>
                  <option value='Processing'>Processing</option>
                  <option value='Dispatched'>Dispatched</option>
                  <option value='Cancelled'>Cancelled</option>
                  <option value='Completed'>Completed</option>
                </select>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Orders
