import React from 'react'
import { Link } from 'react-router-dom'

const UserNav = () => {
  return (
    <nav className='mt-3'>
      <div className='nav flex-column'>
        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/user/history'>History</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/user/password'>Password</Link>
          </div>
        </div>

        <div className='nav-item'>
          <div className='nav-link'>
            <Link to='/user/wishlist'>Wishlist</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default UserNav
