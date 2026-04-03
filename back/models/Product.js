import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String },
  description: { type: String },
  specs:       [String],
  inStock:     { type: Boolean, default: true },
  color:       { type: String }
})

export default mongoose.model('Product', productSchema)