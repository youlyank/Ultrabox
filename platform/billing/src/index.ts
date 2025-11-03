import Fastify from 'fastify'
import cors from '@fastify/cors'
import env from '@fastify/env'
import jwt from '@fastify/jwt'
import webhook from '@fastify/webhook'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { configSchema } from './config'
import { billingRoutes } from './routes/billing'
import { webhookRoutes } from './routes/webhooks'
import { usageRoutes } from './routes/usage'
import { logger } from './utils/logger'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
})

// Initialize Prisma client
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Environment configuration
const envSchema = {
  type: 'object',
  required: ['DATABASE_URL', 'STRIPE_SECRET_KEY', 'JWT_SECRET'],
  properties: {
    PORT: { type: 'string', default: '3001' },
    DATABASE_URL: { type: 'string' },
    STRIPE_SECRET_KEY: { type: 'string' },
    STRIPE_WEBHOOK_SECRET: { type: 'string' },
    JWT_SECRET: { type: 'string' },
    NODE_ENV: { type: 'string', default: 'development' },
    LOG_LEVEL: { type: 'string', default: 'info' },
    CORS_ORIGIN: { type: 'string', default: 'http://localhost:3000' },
  },
}

async function start() {
  try {
    // Register plugins
    await fastify.register(env, {
      schema: envSchema,
      dotenv: true,
    })

    await fastify.register(cors, {
      origin: fastify.config.CORS_ORIGIN,
      credentials: true,
    })

    await fastify.register(jwt, {
      secret: fastify.config.JWT_SECRET,
    })

    await fastify.register(webhook, {
      secret: fastify.config.STRIPE_WEBHOOK_SECRET,
    })

    // Add decorators
    fastify.decorate('prisma', prisma)
    fastify.decorate('stripe', stripe)

    // Health check
    fastify.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'ultra-devbox-billing',
        version: '1.0.0',
      }
    })

    // Register routes
    await fastify.register(billingRoutes, { prefix: '/api/billing' })
    await fastify.register(webhookRoutes, { prefix: '/api/webhooks' })
    await fastify.register(usageRoutes, { prefix: '/api/usage' })

    // Error handler
    fastify.setErrorHandler((error, request, reply) => {
      logger.error('Error occurred:', error)
      
      if (error.validation) {
        reply.status(400).send({
          error: 'Validation Error',
          details: error.validation,
        })
        return
      }

      reply.status(500).send({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      })
    })

    // Start server
    const port = parseInt(fastify.config.PORT || '3001')
    await fastify.listen({ port, host: '0.0.0.0' })
    
    logger.info(`🚀 Ultra DevBox Billing API listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

// Start the server
start()