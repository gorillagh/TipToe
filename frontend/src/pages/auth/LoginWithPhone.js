import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../../firebase'
import firebase from 'firebase/app'
import 'firebase/auth'

import { PhoneOutlined, LoginOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { toast } from 'react-toastify'
import { createOrUpdateUser } from '../../serverFunctions/auth'

const LoginWithPhone = ({ history }) => {
  const [number, setNumber] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState('')
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
    //Hide the completion form
    document.getElementById('form2').style.display = 'none'

    if (user && user.token) history.push('/')
  }, [user, history])

  //Get number from input field
  const getNumber = (e) => {
    setNumber(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    )
    setLoading(true)
    const appVerifier = window.recaptchaVerifier
    auth
      .signInWithPhoneNumber(number, appVerifier)
      .then((res) => {
        toast.success('Verification code sent')
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = res
        console.log(res)
        // history.push('/login/phone/complete')
        document.getElementById('form1').style.display = 'none'
        document.getElementById('form2').style.display = 'block'
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        toast.error('SMS not sent')
        console.log(error)
      })
  }

  const handleSubmitComplete = async () => {
    setLoading(true)
    window.confirmationResult
      .confirm(code)
      .then(async (result) => {
        setLoading(false)
        // User signed in successfully.
        const user = result.user
        const idTokenResult = await user.getIdTokenResult()

        //Sent token to backend
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            console.log(res.data)
            // send response data to redux store
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
              `${
                res.data.name === 'User'
                  ? 'Hello there! Welcome'
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
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        toast.error('Bad verification code!')
        console.log(error)
      })
  }

  const LoginWithPhoneForm = () => {
    return (
      <>
        <form id='form1' onSubmit={handleSubmit} className='mt-3  text-center'>
          <h3 className='text-left'>Sign In With Phone</h3>

          <div className='form-group pt-0 mt-4'>
            <input
              onChange={getNumber}
              className='form-control'
              placeholder='Phone number'
              value={number}
              autoFocus
              disabled={loading}
            />
            <small id='emailHelp' className='form-text text-muted'>
              Provide a valid Phone number.
              <br />
              We'll never share your number with anyone else.
            </small>
          </div>
          <div className='form-group pt-0 mt-4' id='recaptcha-container'></div>

          <div className='form-group'>
            <Button
              loading={loading}
              id='signIn'
              type='primary'
              shape='round'
              icon={<PhoneOutlined />}
              size='large'
              block
              onClick={handleSubmit}
              className='mt-3'
              disabled={!number || loading}
            >
              Send verification code
            </Button>
          </div>
        </form>

        <form
          id='form2'
          // onSubmit={handleSubmitComplete}
          className='mt-3  text-center'
        >
          <h3 className='text-left'>Complete Sign In</h3>

          <div className='form-group mt-4'>
            <input
              onChange={(e) => setCode(e.target.value)}
              className='form-control'
              placeholder='Enter verification code'
              value={code}
              autoFocus
            />
            <small>Please check your phone for verification code.</small>
          </div>
          <div className='form-group'>
            <Button
              loading={loading}
              id='signIn'
              type='primary'
              shape='round'
              icon={<LoginOutlined />}
              size='large'
              block
              onClick={(e) => {
                e.preventDefault()
                handleSubmitComplete()
              }}
              className='mt-3'
              disabled={!code || loading}
            >
              Sign In
            </Button>
          </div>
        </form>
      </>
    )
  }

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-4 offset-md-3'>{LoginWithPhoneForm()}</div>
      </div>
    </div>
  )
}

export default LoginWithPhone
