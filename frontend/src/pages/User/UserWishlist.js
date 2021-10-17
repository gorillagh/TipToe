import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { getWishlist, removeFromWishlist } from '../../serverFunctions/user'
import UserNav from '../../components/Navbar/UserNav'

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    loadWishlist()
  }, [])
  const loadWishlist = () => {
    setLoading(true)
    getWishlist(user.token).then((res) => {
      setLoading(false)
      console.log(res.data)
      setWishlist(res.data.wishlist)
    })
  }

  const handleRemove = (productId) => {
    removeFromWishlist(productId, user.token).then((res) => {
      console.log(res.data)
      loadWishlist()
      toast.success('Item removed from wishlist')
    })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col'>
          <h4>User Wishlist</h4>
          {wishlist.map((p) => {
            return (
              <div key={p._id} className='alert alert-secondary'>
                <Link to={`/product/${p.slug}`}>{p.title}</Link>
                <span
                  onClick={() => handleRemove(p._id)}
                  className='btn btn-sm float-right'
                >
                  <DeleteOutlined className='text-danger' />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserWishlist
