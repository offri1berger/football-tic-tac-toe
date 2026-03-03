import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import logger from './lib/logger'
import { db } from './lib/db'
import { redis } from './lib/redis'

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use(express.json())

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request')
  next()
})

app.get('/health', async (req, res) => {
  try {
    await db.selectFrom('pg_stat_activity').select('pid').limit(1).execute()
    await redis.ping()
    logger.info('Health check passed')
    res.json({ status: 'ok', postgres: 'connected', redis: 'connected' })
  } catch (err) {
    logger.error({ err }, 'Health check failed')
    res.status(500).json({ status: 'error' })
  }
})

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})