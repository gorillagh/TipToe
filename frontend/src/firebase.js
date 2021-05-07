import firebase from 'firebase/app'
import 'firebase/auth'

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGLnyhEX2W6g9HPlosLLSJnUI1UxCSZoE',
  authDomain: 'tiptoe-f5f90.firebaseapp.com',
  projectId: 'tiptoe-f5f90',
  storageBucket: 'tiptoe-f5f90.appspot.com',
  messagingSenderId: '644256857329',
  appId: '1:644256857329:web:e148e5ba949e6a822ebd50',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
// const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
auth.useDeviceLanguage()

//export
export { firebase, auth }
