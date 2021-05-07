import { useEffect } from 'react'
import { auth } from './firebase'
import { useDispatch } from 'react-redux'
import { currentUser } from './serverFunctions/auth'

function LoggedInUser() {
  const dispatch = useDispatch()

  return (
    //Check if user is logged in immediately the component loads
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult()
          console.log('user', user)

          currentUser(idTokenResult.token)
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
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
      //clean up
      return () => unsubscribe()
    }, [dispatch])
  )
}

export default LoggedInUser
