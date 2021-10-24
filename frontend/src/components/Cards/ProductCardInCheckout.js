import React from 'react'
import ModalImage from 'react-modal-image'
import TipToeIcon from '../../images/favicon.ico'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ProductCardInCheckout = ({ p, loading }) => {
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue']
  const dispatch = useDispatch()

  const handleColorChange = (e) => {
    console.log(e.target.value)
    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].color = e.target.value
        }
        return 0
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      dispatch({ type: 'ADD_TO_CART', payload: cart })
    }
  }

  const handleQuantityChange = (e) => {
    // if (e.target.value < 0) {
    //   e.target.value = 1
    // }
    let count = e.target.value < 1 ? 1 : e.target.value
    if (count > p.quantity) {
      toast.error(`Maximum quantity available for ${p.title}: ${p.quantity}`)
      return
    }
    let cart = []
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].count = count
        }
        return 0
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      dispatch({ type: 'ADD_TO_CART', payload: cart })
    }
  }
  const handleKeyPress = (e) => {
    e.preventDefault()
  }

  const handleDeleteItem = () => {
    if (loading) return
    if (
      window.confirm(`You are about to remove "${p.title}" from your cart!`)
    ) {
      let cart = []
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart = cart.filter((product) => product._id !== p._id)
        // cart.map((product, i) => {
        //   if (product._id === p._id) {
        //     cart.splice(i, 1)
        //   }
        // })
        localStorage.setItem('cart', JSON.stringify(cart))
        dispatch({ type: 'ADD_TO_CART', payload: cart })
      }
    } else {
      return
    }
  }
  return (
    <tr>
      <td>
        <div
          className='img img-fluid'
          style={{ width: '4rem', height: 'auto' }}
        >
          {p.images && p.images.length ? (
            <ModalImage
              small={p.images[0].url}
              medium={p.images[0].url}
              hideDownload
              hideZoom
              alt={p.title}
            />
          ) : (
            <ModalImage
              small={TipToeIcon}
              large={TipToeIcon}
              hideDownload
              hideZoom
            />
          )}
        </div>
      </td>
      <td>{p.title}</td>
      <td>{p.price}</td>
      <td>
        <input
          disabled={loading}
          onKeyPress={handleKeyPress}
          type='number'
          className='form-control text-center'
          onChange={handleQuantityChange}
          value={p.count}
          min={1}
          max={p.quantity}
        />
      </td>
      <td>
        <select
          disabled={loading}
          onChange={handleColorChange}
          name='color'
          className='form-control'
        >
          {p.color ? (
            <option value={p.color}>{p.color}</option>
          ) : (
            <option>Select</option>
          )}
          {colors
            .filter((c) => c !== p.color)
            .map((c) => {
              return (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            })}
        </select>
      </td>
      <td>{p.brand}</td>
      <td className='text-center'>
        {p.shipping === 'Yes' ? (
          <>
            {/* <img src='https://img.icons8.com/color/15/000000/checked-radio-button.png' /> */}
            <img
              alt='shipping'
              src='https://img.icons8.com/color/15/000000/delivery--v2.png'
            />
            <br />
            <span>Delivery</span>
          </>
        ) : (
          'Pickup'
        )}
      </td>
      <td className='text-center'>
        <img
          alt='delete'
          onClick={handleDeleteItem}
          className='fas fa-times text-danger btn'
          src='https://img.icons8.com/fluency/15/000000/delete-sign.png'
        />
        {/* <i
          onClick={() => console.log('Delete icon clicked')}
          className='fas fa-times text-danger btn'
        ></i> */}
      </td>
    </tr>
  )
}

export default ProductCardInCheckout
