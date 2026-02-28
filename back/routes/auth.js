import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import logger from '../logger.js'
import User from '../models/User.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    logger.warn(' Invalid token attempt')
    res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' })
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}

const ROLE_MAP = {
  'admin@maison.com': 'admin',
  'store@maison.com': 'store_staff',
  'warehouse@maison.com': 'warehouse_staff',
  'courier@maison.com': 'courier'
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already exists' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name, email, password: hash,
      role: ROLE_MAP[email] || 'user'
    })

    logger.info(`New user registered: ${email} role: ${user.role}`)
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    logger.error(`Register error: ${err.message}`)
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      logger.warn(`Failed login attempt: ${email}`)
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    logger.info(`User logged in: ${email} role: ${user.role}`)
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    logger.error(`Login error: ${err.message}`)
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, { $set: req.body }, { new: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/favorites/:productId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const pid = req.params.productId
    const idx = user.favorites.indexOf(pid)
    if (idx === -1) user.favorites.push(pid)
    else user.favorites.splice(idx, 1)
    await user.save()
    res.json({ favorites: user.favorites })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router