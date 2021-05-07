import React from 'react'

import AdminNav from '../../components/Navbar/AdminNav'

const AdminDashboard = () => {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col my-3'>
          <header className='header'>
            <h4 className='text-center'>Admin Dashboard</h4>
          </header>
          <hr />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
