import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'

//toastify for notification
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { LoadingOutlined } from '@ant-design/icons'

//To check if user is logged in
import LoggedInUser from './LoggedInUser'

//core components
const SideDrawer = lazy(() => import('./components/Drawer/SideDrawer.js'))
const Home = lazy(() => import('./pages/Home.js'))
const Login = lazy(() => import('./pages/auth/Login.js'))
const LoginWithPhone = lazy(() => import('./pages/auth/LoginWithPhone.js'))
const RegisterStart = lazy(() => import('./pages/auth/RegisterStart.js'))
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const Header = lazy(() => import('./components/Navbar/Header'))
const Footer = lazy(() => import('./components/Footer'))
const UserRoute = lazy(() => import('./components/routesComponents/UserRoute'))
const UserHistory = lazy(() => import('./pages/User/UserHistory'))
const UserPassword = lazy(() => import('./pages/User/UserPassword'))
const UserWishlist = lazy(() => import('./pages/User/UserWishlist'))
// const UserNav1 =lazy(()=>import('./components/Navbar/UserNav1'))
const AdminRoute = lazy(() =>
  import('./components/routesComponents/AdminRoute')
)
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const Categories = lazy(() => import('./pages/Admin/category/Categories'))
const UpdateCategory = lazy(() =>
  import('./pages/Admin/category/UpdateCategory')
)
const SubCategories = lazy(() =>
  import('./pages/Admin/subCategory/SubCategories')
)
const UpdateSubCategory = lazy(() =>
  import('./pages/Admin/subCategory/UpdateSubCategory')
)
const CreateProduct = lazy(() =>
  import('./pages/Admin/product/CreateProduct.js')
)
const AllProducts = lazy(() => import('./pages/Admin/product/AllProducts'))
const UpdateProduct = lazy(() => import('./pages/Admin/product/UpdateProduct'))
const Product = lazy(() => import('./pages/Product.js'))
const Category = lazy(() => import('./pages/Category.js'))
const Subcategory = lazy(() => import('./pages/Subcategory.js'))
const Shop = lazy(() => import('./pages/Shop.js'))
const Cart = lazy(() => import('./pages/Cart.js'))
const Checkout = lazy(() => import('./pages/Checkout.js'))
const CreateCouponPage = lazy(() =>
  import('./pages/Admin/coupon/CreateCouponPage.js')
)
const Payment = lazy(() => import('./pages/Payment.js'))
const PaypalPayment = lazy(() => import('./pages/PaypalPayment'))
const OrderResult = lazy(() => import('./pages/OrderResult'))
const PaypalOrderResult = lazy(() => import('./pages/PaypalOrderResult'))

function App() {
  return (
    <Suspense
      fallback={
        <div className='col text-center p-5'>
          TipT
          {<LoadingOutlined />}e
        </div>
      }
    >
      {LoggedInUser()}
      <Header />
      <ToastContainer />
      <SideDrawer />
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
        <Route exact path='/product/:slug' component={Product} />
        <Route exact path='/category/:slug' component={Category} />
        <Route exact path='/subcategory/:slug' component={Subcategory} />
        <Route exact path='/shop' component={Shop} />
        <Route exact path='/cart' component={Cart} />

        <UserRoute exact path='/checkout' component={Checkout} />
        <AdminRoute exact path='/admin/coupon' component={CreateCouponPage} />
        <UserRoute exact path='/payment' component={Payment} />
        <UserRoute
          exact
          path='/paypal-payment/:slug'
          component={PaypalPayment}
        />
        <UserRoute exact path='/order/result' component={OrderResult} />
        <UserRoute
          exact
          path='/:slug/order/result/:orderId'
          component={PaypalOrderResult}
        />
      </Switch>
      <Footer />
    </Suspense>
  )
}

export default App
