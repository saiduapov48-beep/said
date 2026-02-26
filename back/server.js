import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import logger from './logger.js'

dotenv.config()

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Логируем все HTTP запросы
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}))

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info(' MongoDB connected')
    app.listen(process.env.PORT, () => {
      logger.info(` Server running on port ${process.env.PORT}`)
    })
  })
  .catch(err => logger.error(`MongoDB error: ${err.message}`))

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`)
  res.status(err.status || 500).json({ message: err.message })
})