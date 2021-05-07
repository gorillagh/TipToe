import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { auth } from '../../firebase'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { checkEmailAvailability } from '../../serverFunctions/auth'

function RegisterStart({ history }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState('')
  const { user } = useSelector((state) => ({ ...state }))

  //Redirect user to home if they are already logged in
  useEffect(() => {
    if (user && user.token) history.push('/')
  }, [user, history])

  //Get email from input field
  const getEmail = (e) => {
    setEmail(e.target.value)
  }

  //Submit email to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading('loading')
    document
      .querySelectorAll('.label')
      .forEach((label) => (label.style.display = 'none'))
    //firebase configuration
    const actionCodeSettings = {
      url: process.env.REACT_APP_URL_TO_COMPLETE_REGISTER,
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: 'http://localhost:3000/register/complete',
      // },
      // android: {
      //   packageName: 'http://localhost:3000/register/    complete',
      //   installApp: true,
      //   minimumVersion: '12',
      // },
    }

    //Check if the email already exists in firebase
    await checkEmailAvailability(email).then(async (res) => {
      if (res.data !== null) {
        //Send link to email with firebase
        await auth.sendSignInLinkToEmail(email, actionCodeSettings)

        //set success notification
        toast.success(
          'Link sent to ' +
            email +
            ' Please follow the link to complete registration',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )

        //Save user email to localStorage
        window.localStorage.setItem('emailForRegistration', email)

        setEmail('')

        setLoading('')
      } else {
        toast.error('Email already exists!')
        setLoading('')
        return
      }
    })
  }

  const RegisterForm = () => (
    <form onSubmit={handleSubmit} className='mt-3  text-center'>
      <h3 className='text-left'>Sign Up</h3>

      <div className='form-group'>
        <input
          onChange={getEmail}
          type='email'
          className='form-control mt-4'
          aria-describedby='emailHelp'
          value={email}
          required
        />
        <p className='label'>Email</p>
      </div>

      <div className='form-group'>
        <small id='emailHelp' className='form-text text-muted'>
          Provide a valid email.
          <br />
          We'll never share your email with anyone else.
        </small>
        <Button
          loading={loading}
          type='primary'
          shape='round'
          icon={<UserAddOutlined />}
          size='large'
          block
          onClick={handleSubmit}
          className='mt-3'
          disabled={!email}
        >
          Submit
        </Button>
      </div>
    </form>
  )

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
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-4 offset-md-3'>{RegisterForm()}</div>
      </div>
    </div>
  )
}

export default RegisterStart
