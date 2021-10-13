import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/Navbar/AdminNav'
import { getOrders, changeStatus } from '../../serverFunctions/admin'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Orders from '../../components/order/Orders'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    loadOrders()
  }, [])
  const loadOrders = () =>
    getOrders(user.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4))
      setOrders(res.data)
    })

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
          <header className='header'>
            <h4 className='text-center'>Admin Dashboard</h4>
          </header>
          <hr />
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
