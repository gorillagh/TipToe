import React from 'react'
import { Link } from 'react-router-dom'

const AdminNav = () => {
  return (
    <nav className='mt-3'>
      <div className='nav flex-column'>
        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/admin/dashboard'>Dashboard</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/admin/product'>Product</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/admin/products'>Products</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/admin/categories'>Categories</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/admin/subcategories'>Sub Categories</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/admin/coupon'>Coupons</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/user/password'>Password</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNav
