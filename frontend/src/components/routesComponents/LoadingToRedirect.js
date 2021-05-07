import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const LoadingToRedirect = (props) => {
  const [count, setCount] = useState(5)
  const history = useHistory()

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount)
    }, 1000)
    count === 0 && history.push('/login')
    return () => clearInterval(interval)
  }, [count, history])

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h5 className='text-center'>
            {props.message + count + ' second(s)'}
          </h5>
        </div>
      </div>
    </div>
  )
}

export default LoadingToRedirect
