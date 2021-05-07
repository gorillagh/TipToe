const User = require('../models/user')

exports.createOrUpdateUser = async (req, res) => {
  let { email, picture, name } = await req.user

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
    console.log('User Created --->', newUser)
    res.json(newUser)
  } else {
    res.json(user)
    console.log('User Updated --->', user)
  }
}

exports.currentUser = async (req, res) => {
  const { email } = await req.user

  await User.findOne({ email }).exec((err, user) => {
    if (err) throw err
    else res.json(user)
  })
}

exports.checkEmail = async (req, res) => {
  const { email } = req.headers
  const user = await User.findOne({ email }).exec()
  if (user) {
    res.json(null)
  } else res.json('ok')
}
