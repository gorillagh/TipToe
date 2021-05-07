import React, { useState } from 'react'
import { Menu } from 'antd'
import {
  UserAddOutlined,
  HomeOutlined,
  UserOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase'

const { SubMenu, Item } = Menu

function Header() {
  const [current, setCurrent] = useState('home')
  const dispatch = useDispatch()
  const history = useHistory()
  const { user } = useSelector((state) => ({ ...state }))

  const Logout = async () => {
    //Logout user from firebase
    await firebase.auth().signOut()
    //Update redux after logout
    dispatch({
      type: 'LOGGED_OUT',
      payload: null,
    })
    //redirect user to login page
    history.push('/')
  }

  const handleClick = (e) => {
    setCurrent(e.key)
  }

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[current]}
      mode='horizontal'
      className='bg-light'
    >
      <Item key='home' icon={<HomeOutlined />}>
        <Link to='/'>TipToe</Link>
      </Item>

      {!user && (
        <Item key='login' icon={<UserSwitchOutlined />} className='float-right'>
          <Link to='/login'>Login</Link>
        </Item>
      )}

      {!user && (
        <Item key='register' icon={<UserAddOutlined />} className='float-right'>
          <Link to='/register'>Register</Link>
        </Item>
      )}

      {user && (
        <SubMenu
          key='SubMenu'
          icon={<UserOutlined />}
          title={user.email.split('@')[0]}
          className='float-right'
        >
          {user.role === 'admin' ? (
            <Item>
              <Link to='/admin/dashboard'>Dashboard</Link>
            </Item>
          ) : (
            <Item>
              <Link to='/user/history'>Dashboard</Link>
            </Item>
          )}

          <Item key='setting:2'>Option 2</Item>
          <Item icon={<LogoutOutlined />} onClick={Logout}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  )
}

export default Header
