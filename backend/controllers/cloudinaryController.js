const cloudinary = require('cloudinary').v2

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
    })
    res.json({ public_id: result.public_id, url: result.secure_url })
  } catch (error) {
    res.status(400).json({ message: 'Upload Failed' })
  }
}

exports.remove = (req, res) => {
  const image_id = req.body.public_id
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err })
    res.send('Delete successful')
  })
}
