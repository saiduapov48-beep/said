import express from 'express'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { requireAuth, requireAdmin } from './auth.js'
import logger from '../logger.js'

const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, total, deliveryType, shipping, pickup } = req.body
    const order = await Order.create({
      user: req.user.id,
      items, total, deliveryType,
      shipping: deliveryType === 'shipping' ? shipping : null,
      pickup: deliveryType === 'pickup' ? pickup : null
    })

    if (deliveryType === 'shipping') {
      setTimeout(async () => {
        await Order.findByIdAndUpdate(order._id, { status: 'confirmed' })
        logger.info(`Order ${order._id} → confirmed`)
      }, 10000)
      setTimeout(async () => {
        await Order.findByIdAndUpdate(order._id, { status: 'shipped' })
        logger.info(`Order ${order._id} → shipped`)
      }, 30000)
      setTimeout(async () => {
        await Order.findByIdAndUpdate(order._id, { status: 'delivered' })
        logger.info(`Order ${order._id} → delivered`)
      }, 60000)
    }

    logger.info(`📦 New order: ${order._id} by user: ${req.user.id}`)
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/admin/lookup', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { query } = req.query
    let order = null

    if (query.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(query).populate('items.product').populate('user', 'name email')
    } else {
      const user = await User.findOne({ email: query })
      if (user) {
        order = await Order.findOne({
          user: user._id,
          status: { $in: ['pending', 'confirmed', 'ready'] },
          deliveryType: 'pickup'
        }).populate('items.product').populate('user', 'name email')
      }
    }

    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/admin/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product').populate('user', 'name email')
    logger.info(`Admin updated order ${req.params.id} → ${status}`)
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product')
    if (!order) return res.status(404).json({ message: 'Not found' })
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router