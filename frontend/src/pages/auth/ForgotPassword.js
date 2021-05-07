import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Button } from 'antd'
import { UnlockOutlined } from '@ant-design/icons'
import { auth } from '../../firebase'
import { useSelector } from 'react-redux'

function ForgotPassword({ history }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState('')
  const { user } = useSelector((state) => ({ ...state }))
  //Check email string
  const re = /^([0-9A-Za-z_-]+)@([0-9A-Za-z_-]+)\.[a-z]{2,10}$/

  //Redirect user to home if they are already logged in
  useEffect(() => {
    if (user && user.token) history.push('/')
  }, [user, history])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading('loading')

    document
      .querySelectorAll('.label')
      .forEach((label) => (label.style.display = 'none'))

    const actionCodeSettings = {
      url: process.env.REACT_APP_URL_TO_REDIRECT_FROM_FORGOT_PASSWORD,
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: 'com.example.ios'
      // },
      // android: {
      //   packageName: 'com.example.android',
      //   installApp: true,
      //   minimumVersion: '12'
      // }
    }

    auth
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then(function () {
        toast.success(`Password reset link sent to ${email}`)
        // Email sent.
        setEmail('')
        history.push('/login')
      })
      .catch(function (error) {
        // An error happened.
        console.log(error)
        toast.error('An error occured. Please try again!')
        setLoading('')
      })
  }

  const forgotPasswordForm = () => {
    return (
      <form className='mt-3 mb-0  text-center' onSubmit={handleSubmit}>
        <h3 className='text-left'>Forgot Password</h3>

        <div className='form-group'>
          <input
            type='email'
            id='email'
            className='form-control mt-4'
            aria-describedby='emailHelp'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className='label'>Email</p>
        </div>

        <div className='form-group'>
          <small id='emailHelp' className='form-text text-muted'>
            You will receive a link to reset your password.
          </small>
          <div className='form-group'>
            <Button
              loading={loading}
              type='primary'
              shape='round'
              icon={<UnlockOutlined />}
              size='large'
              block
              onClick={handleSubmit}
              className='mt-3'
              disabled={!email || !re.test(email)}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    )
  }

  //This is for the wave effect on form inputs
  const labels = document.querySelectorAll('.form-group .label')
  labels.forEach((label) => {
    label.innerHTML = label.innerText
      .split('')
      .map(
        (letter, idx) =>
          `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
      )
      .join('')
  })

  return (
    <div className='container text-center p-5'>
      <div className='row'>
        <div className='col-md-4 offset-md-3'>{forgotPasswordForm()}</div>
      </div>
    </div>
  )
}

export default ForgotPassword
