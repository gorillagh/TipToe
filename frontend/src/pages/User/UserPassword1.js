import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../../firebase'
import { UserAddOutlined } from '@ant-design/icons'
import { Button } from 'antd'

// import UserNav from '../../components/Navbar/UserNav'
import { toast } from 'react-toastify'

const UserPassword1 = ({ history }) => {
  const [password, setPassword] = useState('')
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
    await auth.currentUser
      .updatePassword(password)
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
  }

  const PasswordForm = () => {
    return (
      <form className='pt-3' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            id='password'
            className='form-control'
            placeholder='Enter new password'
            value={password}
            autoFocus
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
            disabled={password.length < 6 || !password || loading}
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
        <div className='col'>
          <div className='container pt-5'>
            <div className='row'>
              <div className='col-md-6 offset-md-1'>
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

export default UserPassword1
