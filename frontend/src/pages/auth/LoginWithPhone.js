import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { auth } from '../../firebase'
import firebase from 'firebase/app'
import 'firebase/auth'

import { PhoneOutlined, LoginOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { toast } from 'react-toastify'

const LoginWithPhone = ({ history }) => {
  const [number, setNumber] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState('')
  const { user } = useSelector((state) => ({ ...state }))

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
  //Get code from input field
  const getCode = (e) => {
    setCode(e.target.value)
  }

  // // auth.languageCode = 'it'
  // // To apply the default browser preference instead of explicitly setting it.
  setTimeout(() => {
    // const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('signIn', {
    //   size: 'invisible',
    //   callback: (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     handleSubmit()
    //   },
    // })
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container'
    )
  }, 2000)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const appVerifier = window.recaptchaVerifier
    auth
      .signInWithPhoneNumber(number, appVerifier)
      .then((confirmationResult) => {
        toast.success('Verification code sent')
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult
        console.log(confirmationResult)
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

  const handleSubmitComplete = (e) => {
    e.preventDefault()
    setLoading(true)
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        setLoading(false)
        // User signed in successfully.
        toast.success('User signed in successfully')
        const user = result.user
        console.log(user)
        history.push('/')
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

          <div className='form-group'>
            <input
              onChange={getNumber}
              className='form-control'
              placeholder='Enter a valid Phone number'
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
          <div className='form-group' id='recaptcha-container'></div>
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
          onSubmit={handleSubmitComplete}
          className='mt-3  text-center'
        >
          <h3 className='text-left'>Complete Sign In</h3>

          <div className='form-group'>
            <input
              onChange={getCode}
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
              onClick={handleSubmitComplete}
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
