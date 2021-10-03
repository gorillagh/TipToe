import React, { useState } from 'react'
import { Menu } from 'antd'
// import {
//   UserAddOutlined,
//   HomeOutlined,
//   UserOutlined,
//   UserSwitchOutlined,
//   LogoutOutlined,
// } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase'
import { Badge } from 'antd'

import SearchInput from '../Forms/SearchInput'

const { SubMenu, Item } = Menu

function Header() {
  const [current, setCurrent] = useState('home')
  const dispatch = useDispatch()
  const history = useHistory()
  const { user, cart } = useSelector((state) => ({ ...state }))

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
    <div className='bg-white' style={{ height: '55px' }}>
      <div
        style={{ zIndex: '98', height: '54px' }}
        className='position-fixed d-block w-100 bg-white'
      >
        <div style={{ zIndex: '99' }} className='position-fixed d-block w-100'>
          <div className='container px-0'>
            <Menu
              onClick={handleClick}
              selectedKeys={[current]}
              mode='horizontal'
              className='bg-white'
            >
              <Item
                key='home'
                icon={<i className='fas fa-home fa-5x mr-2'></i>}
              >
                <Link to='/'>
                  <span>TipToe</span>
                </Link>
              </Item>

              <Item key='shop' icon={<i className='fas fa-store'></i>}>
                <Link to='/shop'>
                  <span>Shop</span>
                </Link>
              </Item>

              <Item key='cart' icon={<i className='fas fa-shopping-cart'></i>}>
                <Link to='/cart'>
                  <Badge
                    title='Cart'
                    showZero={false}
                    count={
                      <span className='badge badge-danger'>{cart.length}</span>
                    }
                    offset={[9, 0]}
                  >
                    Cart
                  </Badge>
                </Link>
              </Item>

              {!user && (
                <Item
                  key='login'
                  icon={<i className='fas fa-user-cog mr-2'></i>}
                  className='float-right'
                >
                  <Link to='/login'>
                    <span>Login</span>
                  </Link>
                </Item>
              )}

              {!user && (
                <Item
                  key='register'
                  icon={<i className='fas fa-user-plus mr-2'></i>}
                  className='float-right'
                >
                  <Link to='/register'>
                    <span>Register</span>
                  </Link>
                </Item>
              )}

              {user && (
                <SubMenu
                  key='SubMenu'
                  icon={
                    user.picture ? (
                      <img
                        alt='User pic'
                        style={{ width: '25px', height: '25px' }}
                        className='img img-fluid rounded mr-2'
                        src={user.picture}
                      />
                    ) : (
                      <i className='fas fa-user mr-2'></i>
                    )
                  }
                  title={
                    user.name
                      ? user.name.split(' ')[0]
                      : user.email.split('@')[0]
                  }
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
                  <Item
                    icon={<i className='fas fa-sign-out-alt mr-2'></i>}
                    onClick={Logout}
                  >
                    Logout
                  </Item>
                </SubMenu>
              )}
              <span className='float-right p-1' key='search'>
                <SearchInput />
              </span>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

// import React from 'react'
// import { fade, makeStyles } from '@material-ui/core/styles'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import IconButton from '@material-ui/core/IconButton'
// import Typography from '@material-ui/core/Typography'
// import InputBase from '@material-ui/core/InputBase'
// import Badge from '@material-ui/core/Badge'
// import MenuItem from '@material-ui/core/MenuItem'
// import Menu from '@material-ui/core/Menu'
// import MenuIcon from '@material-ui/icons/Menu'
// import SearchIcon from '@material-ui/icons/Search'
// import AccountCircle from '@material-ui/icons/AccountCircle'
// import MailIcon from '@material-ui/icons/Mail'
// import NotificationsIcon from '@material-ui/icons/Notifications'
// import MoreIcon from '@material-ui/icons/MoreVert'

// const useStyles = makeStyles((theme) => ({
//   grow: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     [theme.breakpoints.up('md')]: {
//       display: 'none',
//     },
//     marginRight: theme.spacing(2),
//   },

//   search: {
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: 'fade(theme.palette.common.white, 0.15)',
//     '&:hover': {
//       backgroundColor: fade(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       marginLeft: theme.spacing(3),
//       width: 'auto',
//     },
//   },
//   searchIcon: {
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputRoot: {
//     color: 'inherit',
//   },
//   inputInput: {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//   },
//   sectionDesktop: {
//     display: 'none',
//     [theme.breakpoints.up('md')]: {
//       display: 'flex',
//     },
//   },
//   sectionMobile: {
//     display: 'flex',
//     [theme.breakpoints.up('md')]: {
//       display: 'none',
//     },
//   },
// }))

// function Header() {
//   const classes = useStyles()
//   const [anchorEl, setAnchorEl] = React.useState(null)
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

//   const isMenuOpen = Boolean(anchorEl)
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//     handleMobileMenuClose()
//   }

//   const handleMobileMenuOpen = (event) => {
//     setMobileMoreAnchorEl(event.currentTarget)
//   }

//   const menuId = 'primary-search-account-menu'
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//     </Menu>
//   )

//   const mobileMenuId = 'primary-search-account-menu-mobile'
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem>
//         <IconButton aria-label='show 4 new mails' color='inherit'>
//           <Badge badgeContent={4} color='secondary'>
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem>
//       <MenuItem>
//         <IconButton aria-label='show 11 new notifications' color='inherit'>
//           <Badge badgeContent={11} color='secondary'>
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem>
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           aria-label='account of current user'
//           aria-controls='primary-search-account-menu'
//           aria-haspopup='true'
//           color='inherit'
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   )

//   return (
//     <div style={{ height: '64px' }}>
//       <div className={classes.grow}>
//         <AppBar className='bg-light text-dark' position='fixed'>
//           <Toolbar>
//             <IconButton
//               edge='start'
//               className={classes.menuButton}
//               color='inherit'
//               aria-label='open drawer'
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography className={classes.title} variant='h6' noWrap>
//               TipToe
//             </Typography>
//             <div className={classes.search}>
//               <div className={classes.searchIcon}>
//                 <SearchIcon />
//               </div>
//               <InputBase
//                 placeholder='Search…'
//                 classes={{
//                   root: classes.inputRoot,
//                   input: classes.inputInput,
//                 }}
//                 inputProps={{ 'aria-label': 'search' }}
//               />
//             </div>
//             <div className={classes.grow} />
//             <div className={classes.sectionDesktop}>
//               <IconButton aria-label='show 4 new mails' color='inherit'>
//                 <Badge badgeContent={4} color='secondary'>
//                   <MailIcon />
//                 </Badge>
//               </IconButton>
//               <IconButton
//                 aria-label='show 17 new notifications'
//                 color='inherit'
//               >
//                 <Badge badgeContent={17} color='secondary'>
//                   <NotificationsIcon />
//                 </Badge>
//               </IconButton>
//               <IconButton
//                 edge='end'
//                 aria-label='account of current user'
//                 aria-controls={menuId}
//                 aria-haspopup='true'
//                 onClick={handleProfileMenuOpen}
//                 color='inherit'
//               >
//                 <AccountCircle />
//               </IconButton>
//             </div>
//             <div className={classes.sectionMobile}>
//               <IconButton
//                 aria-label='show more'
//                 aria-controls={mobileMenuId}
//                 aria-haspopup='true'
//                 onClick={handleMobileMenuOpen}
//                 color='inherit'
//               >
//                 <MoreIcon />
//               </IconButton>
//             </div>
//           </Toolbar>
//         </AppBar>
//         {renderMobileMenu}
//         {renderMenu}
//       </div>
//     </div>
//   )
// }

// export default Header
