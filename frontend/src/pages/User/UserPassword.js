import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../../firebase'
import { LockFilled } from '@ant-design/icons'
import { Button } from 'antd'

import UserNav from '../../components/Navbar/UserNav'
import { toast } from 'react-toastify'

const UserPassword = ({ history }) => {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // -------------------Send password change link to email --------------------------
    // const { email } = await auth.currentUser

    // const actionCodeSettings = {
    //   url: process.env.REACT_APP_URL_TO_REDIRECT_FROM_FORGOT_PASSWORD,
    //   handleCodeInApp: true,
    //   // iOS: {
    //   //   bundleId: 'com.example.ios'
    //   // },
    //   // android: {
    //   //   packageName: 'com.example.android',
    //   //   installApp: true,
    //   //   minimumVersion: '12'
    //   // }
    // }

    // auth
    //   .sendPasswordResetEmail(email, actionCodeSettings)
    //   .then(function () {
    //     setLoading('')
    //     toast.success(`Link sent to your email (${email}) to change password`)
    //   })
    //   .catch(function (error) {
    //     // An error happened.
    //     console.log(error)
    //     toast.error('An error occured. Please try again!')
    //     setLoading('')
    //   })
    //------------------------------------------------------------------------------------------------

    if (password1 === password2) {
      await auth.currentUser
        .updatePassword(password1)
        .then(async () => {
          setLoading(false)
          await auth.signOut()
          //Update redux after logout
          dispatch({
            type: 'LOGGED_OUT',
            payload: null,
          })
          toast.success(
            'Password changed successfully. Login with the new password'
          )
          //redirect user to login page
          history.push('/login')
        })

        .catch((err) => {
          setLoading(false)
          toast.error(`An error occured please try again. Error->${err}`)
          console.log(err)
        })
    } else {
      setLoading(false)
      toast.error('The passwords must much! Please try again.')
      return
    }
  }

  const PasswordForm = () => {
    return (
      <form className='pt-3' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            onChange={(e) => setPassword1(e.target.value)}
            type='password'
            className='form-control'
            placeholder='Enter new password'
            value={password1}
            required={true}
            autoFocus
            disabled={loading}
            autoComplete='off'
          />
          <small id='emailHelp' className='form-text text-muted'>
            Password must be 6 characters or more
          </small>
        </div>

        <div className='form-group'>
          <input
            onChange={(e) => setPassword2(e.target.value)}
            type='password'
            className='form-control'
            placeholder='Confirm new password'
            value={password2}
            required={true}
            disabled={loading}
            autoComplete='off'
          />
          <small id='emailHelp' className='form-text text-muted'>
            Password must match the above!
          </small>
        </div>

        <div className='form-group'>
          <Button
            loading={loading}
            type='primary'
            shape='round'
            icon={<LockFilled />}
            size='large'
            block
            onClick={handleSubmit}
            className='mt-3'
            disabled={
              password1.length < 6 ||
              password2.length < 6 ||
              !password1 ||
              !password2 ||
              loading
            }
          >
            Change Password
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col'>
          <div className='container pt-5'>
            <div className='row'>
              <div className='col-md-4 offset-md-1'>
                <h4>Change Password</h4>
                {PasswordForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPassword
