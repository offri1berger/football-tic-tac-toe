import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import logger from './lib/logger'

const app = express()
const PORT = process.env.PORT || 3000

// Security
app.use(helmet())

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per IP
})
app.use(limiter)

// Body parsing
app.use(express.json())

app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request')
    next()
  })

// Health check
app.get('/health', (req, res) => {
    logger.info('Health check response sent')
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})

export default app