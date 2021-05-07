import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { auth } from '../../firebase'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { createOrUpdateUser } from '../../serverFunctions/auth'

function RegisterComplete({ history }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    if (user && user.token) history.push('/')
  }, [user, history])

  //Get email of user from local storage
  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'))
  }, [])

  //complete registration and add password to user account
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading('loading')
    try {
      if (!email || !password) {
        setLoading('')
        toast.error('Both email address and password required')
        return
      }
      if (password.length < 6) {
        setLoading('')
        toast.error('Enter atleast 6 Characters for your password')
        return
      }

      // Confirm the link is a sign-in with email link.
      if (auth.isSignInWithEmailLink(window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        setEmail(window.localStorage.getItem('emailForRegistration'))

        // The client SDK will parse the code from the link for you.
        const data = await auth.signInWithEmailLink(email, window.location.href)

        // Clear email from storage.
        window.localStorage.removeItem('emailForRegistration')

        // You can access the new user via data.user
        const result = data.user

        if (result.emailVerified) {
          const user = auth.currentUser
          //add password to user profile
          await user.updatePassword(password)
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
              toast.success(`Welcome ${email.split('@')[0]}`)
              roleBasedRedirect(res.data)
            })
            .catch((err) => {
              if (err.status === 401) {
                toast.error(
                  'Your session has expired. Please try log in again!'
                )
              } else console.log('Error: ', err)
            })
        }
      } else {
        setLoading('')
        toast.error('An error Occured. Please try again!')
      }
    } catch (error) {
      setLoading('')
      toast.error('An error Occured. Please try again!')
    }
  }

  const CompleteRegistrationForm = () => (
    <form onSubmit={handleSubmit} className='mt-3 mb-0  text-center'>
      <h3 className=' text-left'>Complete Registration</h3>

      <div className='form-group'>
        <input
          type='email'
          id='email'
          className='form-control'
          aria-describedby='emailHelp'
          value={email}
          disabled
        />
      </div>
      <div className='form-group'>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          id='password'
          className='form-control'
          placeholder='Enter Password'
          value={password}
          autoFocus
          autoComplete='off'
        />
        <small id='emailHelp' className='form-text text-muted'>
          Password must atleast 6 characters.
        </small>
      </div>

      <div className='form-group'>
        <Button
          loading={loading}
          type='primary'
          shape='round'
          icon={<UserAddOutlined />}
          size='large'
          block
          onClick={handleSubmit}
          className='mt-3'
          disabled={password.length < 6}
        >
          SignUp
        </Button>
      </div>
    </form>
  )

  return (
    <div className='container text-center p-5'>
      <div className='row'>
        <div className='col-md-4 offset-md-3'>{CompleteRegistrationForm()}</div>
      </div>
    </div>
  )
}

export default RegisterComplete
