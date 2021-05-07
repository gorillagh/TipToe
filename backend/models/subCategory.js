const { Schema, model, isValidObjectId } = require('mongoose')
const { ObjectId } = Schema

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: 'Name is required',
      trim: true,
      minLength: [2, 'Too short'],
      maxLength: [35, 'Too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: { type: ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
)

module.exports = model('SubCategory', subCategorySchema)
