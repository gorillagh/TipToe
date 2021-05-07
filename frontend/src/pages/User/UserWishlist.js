import React from 'react'
import UserNav from '../../components/Navbar/UserNav'

const UserWishlist = () => {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col'>
          <h4>User Wishlist</h4>
        </div>
      </div>
    </div>
  )
}

export default UserWishlist
