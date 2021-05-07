import React from 'react'
import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import LoadingToRedirect from './LoadingToRedirect'

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }))
  return user && user.token ? (
    <Route {...rest} />
  ) : (
    <LoadingToRedirect message='You are not logged in. You will be redirect to login page in ' />
  )
}

export default UserRoute
