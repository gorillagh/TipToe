import React, { useCallback, useEffect, useState } from 'react'
import AdminNav from '../../components/Navbar/AdminNav'
import { getOrders, changeStatus } from '../../serverFunctions/admin'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Orders from '../../components/order/Orders'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => ({ ...state }))

  const loadOrders = useCallback(() => {
    getOrders(user.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4))
      setOrders(res.data)
      setLoading(false)
    })
  }, [user.token])

  useEffect(() => {
    setLoading(true)
    loadOrders()
  }, [loadOrders])

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      toast.success('Status updated')
      loadOrders()
    })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-8 my-3'>
          <h4 className='text-center'>Admin Dashboard</h4>
          <hr />
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <Orders orders={orders} handleStatusChange={handleStatusChange} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
