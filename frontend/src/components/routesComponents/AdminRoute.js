import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import LoadingToRedirect from './LoadingToRedirect'
import { currentAdmin } from '../../serverFunctions/auth'
import { toast } from 'react-toastify'

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setOk(true)
          console.log('Current admin -->', res)
        })
        .catch((err) => {
          setOk(false)
          console.log(err)
          toast.error(err)
        })
    }
  }, [user])

  return ok ? (
    <Route {...rest} />
  ) : (
    <LoadingToRedirect message='Unauthorized Access! You are not an admin. Redirecting in ' />
  )
}

export default AdminRoute
