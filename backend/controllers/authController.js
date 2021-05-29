const User = require('../models/user')

exports.createOrUpdateUser = async (req, res) => {
  let { email, picture, name, phone_number } = await req.user
  if (name) {
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
    )

    if (!user) {
      const newUser = await new User({
        email,
        picture,
        name,
      }).save()
      // console.log('User Created --->', newUser)
      res.json(newUser)
    } else {
      res.json(user)
      // console.log('User Updated --->', user)
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
}

exports.currentUser = async (req, res) => {
  const { email, phone_number } = await req.user

  if (email) {
    await User.findOne({ email }).exec((err, user) => {
      if (err) throw err
      else res.json(user)
    })
  } else {
    await User.findOne({ email: phone_number }).exec((err, user) => {
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
