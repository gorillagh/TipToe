import React from 'react'
import { Drawer, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import TipTopeIcon from '../../images/favicon.ico'

const SideDrawer = ({ children }) => {
  const dispatch = useDispatch()
  const { drawer, cart } = useSelector((state) => ({ ...state }))

  const imageStyle = {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
  }

  const handleSideDrawerClose = () => {
    dispatch({
      type: 'SET_VISIBLE',
      payload: false,
    })
  }
  return (
    <Drawer
      // title={`${cart.length} Items in Cart`}
      title={
        <div>
          <h5>
            {cart.length} Item{'('}s{')'} in Cart
          </h5>
          <Link to='/cart'>
            <Button
              onClick={handleSideDrawerClose}
              className=' btn raised bg-primary'
              type='primary'
              color='green'
            >
              Go To Cart
            </Button>
          </Link>
          {/* <button className='btn btn-primary'>Go to Cart</button> */}
        </div>
      }
      placement='right'
      onClose={handleSideDrawerClose}
      visible={drawer}
    >
      {cart.length ? (
        cart.map((p) => {
          return (
            <div key={p._id} className='row'>
              <div className='col'>
                {p.images[0] ? (
                  <div className='row'>
                    <div className='col border'>
                      <img alt='' src={p.images[0].url} style={imageStyle} />
                    </div>
                    <div className='col border'>
                      <small>
                        {p.title} x {p.count}
                      </small>
                    </div>
                  </div>
                ) : (
                  <div className='row'>
                    <img alt='' src={TipTopeIcon} style={imageStyle} />
                    <small className='text-center bg-secondary text-light'>
                      {p.title} x {p.count}
                    </small>
                  </div>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <h5>No Items in Cart ...</h5>
      )}
      <div className='text-center my-3'></div>
      <Link to='/cart'>
        <Button
          onClick={handleSideDrawerClose}
          className=' btn raised bg-primary btn-block'
          type='primary'
          color='green'
        >
          Go To Cart
        </Button>
      </Link>
    </Drawer>
  )
}

export default SideDrawer
