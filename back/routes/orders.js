import express from 'express'
import Order from '../models/Order.js'
import { requireAuth } from './auth.js'
import logger from '../logger.js'

const router = express.Router()


router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, total, shipping } = req.body

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      shipping
    })

    logger.info(`📦 New order created: ${order._id} by user: ${req.user.id}`)
    res.status(201).json(order)
  } catch (err) {
    logger.error(`Order error: ${err.message}`)
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


router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router