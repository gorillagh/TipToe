const { Schema, model, isValidObjectId } = require('mongoose')
const { ObjectId } = Schema

const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required',
      minLength: [6, 'Too short'],
      maxLength: [12, 'Too short'],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Coupon', couponSchema)
