import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { auth } from '../../firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import {
  LoginOutlined,
  GooglePlusOutlined,
  PhoneFilled,
} from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { createOrUpdateUser } from '../../serverFunctions/auth'

function Login({ history }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading1, setLoading1] = useState('')
  const [loading2, setLoading2] = useState('')
  const dispatch = useDispatch()
  const { user } = useSelector((state) => ({ ...state }))

  const roleBasedRedirect = (user) => {
    if (user.role === 'admin') {
      history.push('/admin/dashboard')
    } else {
      history.push('/user/history')
    }
  }

  //Redirect user to home if they are already logged in
  useEffect(() => {
    if (user && user.token) history.push('/')
  }, [user, history])

  //Sign in user with Email and password
  const handleLoginWithEmail = async (e) => {
    e.preventDefault()
    setLoading1('loading')
    document
      .querySelectorAll('.label')
      .forEach((label) => (label.style.display = 'none'))
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      )
      const user = userCredential.user
      const idTokenResult = await user.getIdTokenResult()

      //Sent token to backend
      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          //send response data to redux store
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              email: res.data.email,
              name: res.data.name,
              role: res.data.role,
              picture: res.data.picture,
              token: idTokenResult.token,
              _id: res.data._id,
            },
          })
          toast.success(
            `Welcome ${
              res.data.name
                ? res.data.name.split(' ')[0]
                : user.email.split('@')[0]
            }`
          )
          roleBasedRedirect(res.data)
        })
        .catch((err) => {
          if (err.status === 401) {
            toast.error('Your session has expired. Please try log in again!')
          } else console.log('Error: ', err)
        })
    } catch (error) {
      setLoading1('')
      document
        .querySelectorAll('.label')
        .forEach((label) => (label.style.display = 'block'))
      console.log(error)
      toast.error(error)
      if (error.code === 'auth/wrong-password') {
        toast.error('Wrong password. Please enter a correct password!')
        document.body.style.background = 'red'
        setTimeout(() => {
          document.body.style.background = 'white'
        }, 300)
        setTimeout(() => {
          document.body.style.background = 'red'
        }, 500)
        setTimeout(() => {
          document.body.style.background = 'white'
        }, 700)
        setTimeout(() => {
          document.body.style.background = 'red'
        }, 800)
        setTimeout(() => {
          document.body.style.background = 'white'
        }, 1000)
      }
      if (error.code === 'auth/network-request-failed') {
        toast.error('Please check your internet connection and try again!')
      }
      if (error.code === 'auth/user-not-found') {
        toast.error('You are not registered. Please registered!')
      }
    }
  }

  //Sign in user with Google
  const handleLoginWithGoogle = async (e) => {
    e.preventDefault()
    setLoading2('loading')

    try {
      const provider = await new firebase.auth.GoogleAuthProvider()
      const result = await auth.signInWithPopup(provider)
      // const credential = result.credential
      // const token = await credential.accessToken
      const user = result.user
      const idTokenResult = await user.getIdTokenResult()

      //Sent token to backend
      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          //send response data to redux store
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              email: res.data.email,
              name: res.data.name,
              role: res.data.role,
              picture: res.data.picture,
              token: idTokenResult.token,
              _id: res.data._id,
            },
          })
          toast.success(
            `Welcome ${
              res.data.name
                ? res.data.name.split(' ')[0]
                : user.email.split('@')[0]
            }`
          )
          roleBasedRedirect(res.data)
        })
        .catch((err) => {
          if (err.status === 401) {
            toast.error('Your session has expired. Please try log in again!')
          } else console.log('Error: ', err)
        })
    } catch (error) {
      console.log(error.message, error.code)
      toast.error('An error occured. Please try again!')
      setLoading2('')
    }
  }

  const handleLoginWithPhone = (e) => {
    e.preventDefault()
    history.push('/login/phone')
  }

  const LoginForm = () => (
    <div>
      <h3 className=' text-center'>Login</h3>

      <div className='row w-100 m-auto'>
        <div className='col-lg-6 px-5'>
          <form
            onSubmit={handleLoginWithEmail}
            className='mt-3 mb-0 text-center'
          >
            <div className='form-group pt-0'>
              <input
                type='email'
                id='email'
                placeholder='Email'
                className='form-control '
                // aria-describedby='emailHelp'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                // autoFocus
                disabled={loading1 || loading2}
                required
              />
              {/* <p className='label'>Email</p> */}
            </div>
            <div className='form-group pt-0 mt-4'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                id='password'
                className='form-control '
                placeholder='Password'
                value={password}
                disabled={loading1 || loading2}
                autoComplete='off'
                required
              />
              {/* <p className='label'>Password</p> */}
            </div>
            <div className='form-group mt-4'>
              <Button
                loading={loading1}
                type='primary'
                shape='round'
                icon={<LoginOutlined />}
                size='large'
                block
                disabled={!email || password.length < 6}
                onClick={handleLoginWithEmail}
              >
                Login with Email
              </Button>
            </div>
            <p>
              Forgot password?{' '}
              <u>
                <Link to='/forgotpassword'>Click here</Link>
              </u>
            </p>
          </form>
        </div>

        <div className='col-lg-6 px-5'>
          <h5 className='text-muted mb-2 d-lg-none'>OR</h5>
          <form onSubmit={handleLoginWithGoogle} className='mt-0 text-center'>
            <div className='form-group mt-3'>
              <Button
                loading={loading2}
                type='danger'
                shape='round'
                icon={<GooglePlusOutlined />}
                size='large'
                block
                onClick={handleLoginWithGoogle}
              >
                Login with Google
              </Button>
            </div>
            <div className='form-group'>
              <h5 className='text-muted mb-2'>OR</h5>
              <Button
                loading={loading2}
                type='dark'
                shape='round'
                icon={<PhoneFilled />}
                size='large'
                block
                onClick={handleLoginWithPhone}
                // disabled
              >
                Login with Phone
              </Button>
            </div>
            <p className='mt-4'>
              Don't have an account?{' '}
              <u>
                <Link to='/register'>Register now</Link>
              </u>
            </p>
          </form>
        </div>
      </div>
    </div>
  )

  //This is for the wave effect on form inputs
  // const labels = document.querySelectorAll('.form-group .label')
  // labels.forEach((label) => {
  //   label.innerHTML = label.innerText
  //     .split('')
  //     .map(
  //       (letter, idx) =>
  //         `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
  //     )
  //     .join('')
  // })

  return (
    <div className='container text-center p-3 mt-3'>
      <div className=''>
        <div className=''>{LoginForm()}</div>
      </div>
    </div>
  )
}

export default Login
