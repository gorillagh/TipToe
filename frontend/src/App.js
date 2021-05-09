import React from 'react'

//toastify for notification
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//core components
import Home from './pages/Home.js'
import Login from './pages/auth/Login.js'
import LoginWithPhone from './pages/auth/LoginWithPhone.js'
import RegisterStart from './pages/auth/RegisterStart.js'
import RegisterComplete from './pages/auth/RegisterComplete'
import ForgotPassword from './pages/auth/ForgotPassword'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Navbar/Header'
import Footer from './components/Footer'
import UserRoute from './components/routesComponents/UserRoute'
import UserHistory from './pages/User/UserHistory'
import UserPassword from './pages/User/UserPassword'
import UserWishlist from './pages/User/UserWishlist'
// import UserNav1 from './components/Navbar/UserNav1'
import AdminRoute from './components/routesComponents/AdminRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Categories from './pages/Admin/category/Categories'
import UpdateCategory from './pages/Admin/category/UpdateCategory'
import SubCategories from './pages/Admin/subCategory/SubCategories'
import UpdateSubCategory from './pages/Admin/subCategory/UpdateSubCategory'
import CreateProduct from './pages/Admin/product/CreateProduct.js'
import AllProducts from './pages/Admin/product/AllProducts'
import UpdateProduct from './pages/Admin/product/UpdateProduct'

//To check if user is logged in
import LoggedInUser from './LoggedInUser'

function App() {
  return (
    <>
      {LoggedInUser()}
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/login/phone' component={LoginWithPhone} />
        <Route exact path='/register' component={RegisterStart} />
        <Route exact path='/register/complete' component={RegisterComplete} />
        <Route exact path='/forgotpassword' component={ForgotPassword} />
        <UserRoute exact path='/user/history' component={UserHistory} />
        <UserRoute exact path='/user/password' component={UserPassword} />
        <UserRoute exact path='/user/wishlist' component={UserWishlist} />
        {/* <UserRoute exact path='/user/user-password' component={UserNav1} /> */}
        <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRoute exact path='/admin/categories' component={Categories} />
        <AdminRoute
          exact
          path='/category/update/:slug'
          component={UpdateCategory}
        />
        <AdminRoute
          exact
          path='/admin/subcategories'
          component={SubCategories}
        />
        <AdminRoute
          exact
          path='/subcategory/update/:slug'
          component={UpdateSubCategory}
        />
        <AdminRoute exact path='/admin/product' component={CreateProduct} />
        <AdminRoute exact path='/admin/products' component={AllProducts} />
        <AdminRoute
          exact
          path='/admin/product/:slug'
          component={UpdateProduct}
        />
      </Switch>
      <Footer />
    </>
  )
}

export default App
