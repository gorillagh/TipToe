const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { ObjectId } = Schema

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subcategories: [
      {
        type: ObjectId,
        ref: 'SubCategory',
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ['Yes', 'No'],
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    },
    brand: {
      type: String,
      enum: [
        'Apple',
        'Samsung',
        'Microsoft',
        'Lenovo',
        'Asus',
        'Bose',
        'Sony',
        'Thrustmaster',
        'PlayStation',
        'Xbox',
      ],
    },
    // ratings: [
    //   {
    //     star: Number,
    //     postedby: { type: ObjectId, ref: 'User' },
    //   },
    // ],
  },
  { timestamps: true }
)

module.exports = model('Product', productSchema)
