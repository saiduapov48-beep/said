import express from 'express'
import Cart from '../models/Cart.js'
import { requireAuth } from './auth.js'
import logger from '../logger.js'

const router = express.Router()

// GET /api/cart
router.get('/', requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    res.json(cart || { items: [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/cart — добавить товар
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body
    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ product: productId, quantity }] })
    } else {
      const idx = cart.items.findIndex(i => i.product.toString() === productId)
      if (idx !== -1) cart.items[idx].quantity += quantity
      else cart.items.push({ product: productId, quantity })
      await cart.save()
    }

    await cart.populate('items.product')
    logger.info(`🛒 Cart updated for user: ${req.user.id}`)
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/cart/:productId — изменить количество
router.patch('/:productId', requireAuth, async (req, res) => {
  try {
    const { quantity } = req.body
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const idx = cart.items.findIndex(i => i.product.toString() === req.params.productId)
    if (idx === -1) return res.status(404).json({ message: 'Item not found' })

    if (quantity <= 0) cart.items.splice(idx, 1)
    else cart.items[idx].quantity = quantity

    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/cart/:productId — удалить товар
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId)
    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/cart — очистить корзину
router.delete('/', requireAuth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id })
    res.json({ items: [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router