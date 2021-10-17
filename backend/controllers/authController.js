const User = require('../models/user')

exports.createOrUpdateUser = async (req, res) => {
  try {
    let { email, picture, name, phone_number } = await req.user
    console.log('Request user =====>', req.user)
    if (name || email) {
      {
        name ? (name = await name) : (name = await email.split('@')[0])
      }

      const user = await User.findOneAndUpdate(
        { email },
        {
          email,
          picture,
          name,
        },
        { new: true }
      ).exec()

      if (!user) {
        const newUser = await new User({
          email,
          picture,
          name,
        }).save()
        console.log('User Created --->', newUser)
        res.json(newUser)
      } else {
        res.json(user)
        console.log('User Updated --->', user)
      }
    } else {
      const user = await User.findOneAndUpdate(
        { email: phone_number },
        {
          email: phone_number,
          picture: null,
          name: 'User',
        },
        { new: true }
      )
      if (!user) {
        const newUser = await new User({
          email: phone_number,
          picture: null,
          name: 'User',
        }).save()
        // console.log('User Created --->', newUser)
        res.json(newUser)
      } else {
        res.json(user)
        // console.log('User Updated --->', user)
      }
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.currentUser = async (req, res) => {
  const { email, phone_number } = await req.user

  if (email) {
    User.findOne({ email }).exec((err, user) => {
      if (err) throw err
      else res.json(user)
    })
  } else {
    User.findOne({ email: phone_number }).exec((err, user) => {
      if (err) throw err
      else res.json(user)
    })
  }
}

exports.checkEmail = async (req, res) => {
  const { email } = req.headers
  const user = await User.findOne({ email }).exec()
  if (user) {
    res.json(null)
  } else res.json('ok')
}
