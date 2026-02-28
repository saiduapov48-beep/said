import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
  deliveryType: { type: String, default: 'shipping', enum: ['shipping', 'pickup'] },
  shipping: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zip: String,
    country: String,
    notes: String
  },
  pickup: {
    storeId: Number,
    storeName: String,
    storeAddress: String,
    city: String,
    phone: String,
    hours: String
  }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)