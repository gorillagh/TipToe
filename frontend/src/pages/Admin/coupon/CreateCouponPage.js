import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { DeleteOutlined } from '@ant-design/icons'
import DatePicker from 'react-date-picker'
// import 'react-date-picker/dist/react-datepicker.css'
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from '../../../serverFunctions/coupon'
import AdminNav from '../../../components/Navbar/AdminNav'

const CreateCouponPage = () => {
  const { user } = useSelector((state) => ({ ...state }))
  const [coupons, setCoupons] = useState([])
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  //Load all coupons
  useEffect(() => {
    loadCoupons()
  }, [])
  const loadCoupons = () => {
    setLoading(true)
    getCoupons().then((res) => {
      setCoupons(res.data)
      setLoading(false)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // console.table(name, expiry, discount)
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false)
        setName('')
        setDiscount(0)
        setExpiry()
        loadCoupons()
        toast.success(`"${res.data.name}" coupon is created`)
      })
      .catch((err) => console.log('Create Coupon error!', err))
  }

  const handleRemoveCoupon = async (coupon) => {
    if (window.confirm(`You are about to delete "${coupon.name}" coupon!`)) {
      removeCoupon(coupon._id, user.token)
        .then((res) => {
          if (res.status === 200) {
            loadCoupons()
            toast(`${res.data.name} has been successfully deleted`)
          }
        })
        .catch((err) => console.log('Coupon deletion error', err))
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col-md-6'>
          <h4 className='my-3 text-center'>Coupons</h4>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label className='text-mute'>Name:</label>
              <input
                type='text'
                className='form-control'
                onChange={(e) => {
                  setName(e.target.value)
                }}
                value={name}
                autoFocus
                required
              />
            </div>

            <div className='row'>
              <div className='col-md-6'>
                <label>Expiry Date: </label>
                <br />
                <DatePicker
                  className='form-control'
                  selected={new Date()}
                  value={expiry}
                  onChange={(date) => setExpiry(date)}
                  required
                />
              </div>

              <div className='col-md-6'>
                <label>Discount: </label>
                <input
                  type='number'
                  className='form-control'
                  onChange={(e) => {
                    setDiscount(e.target.value)
                  }}
                  value={discount}
                  required
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className='mt-3 btn btn-block btn-lg btn-raised btn-success'
            >
              Save
            </button>
          </form>

          <hr className='my-3' />
          {loading ? (
            <h5>loading...</h5>
          ) : (
            <table className='table table-bordered'>
              <thead className='thead-dark'>
                <tr>
                  <th scope='col'>Name</th>
                  <th scope='col'>Expiry</th>
                  <th scope='col'>Discount(%)</th>
                  <th className='text-center' scope='col'>
                    X
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.name}</td>
                    <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                    <td>{coupon.discount}</td>
                    <td className='text-center'>
                      <span>
                        <DeleteOutlined
                          className='btn btn-sm btn-danger mx-2'
                          onClick={() => handleRemoveCoupon(coupon)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateCouponPage
