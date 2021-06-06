const admin = require('../firebase/index')
const User = require('../models/user')

exports.checkAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authtoken
    const fbUser = await admin.auth().verifyIdToken(idToken)
    req.user = fbUser
    // console.log('Backend checkauth -->', fbUser)
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
    // console.log(error)
  }
}

exports.checkAdmin = async (req, res, next) => {
  try {
    const { email } = await req.user
    const adminUser = await User.findOne({ email }).exec()
    if (adminUser.role === 'admin') {
      next()
    } else {
      res.status(403).json({ error: 'Unauthorized access!' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
