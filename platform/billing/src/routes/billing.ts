import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { plans, billingTiers } from '../config'

const billingRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma, stripe } = fastify

  // Get current user's billing info
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        paymentMethods: {
          where: { isDefault: true },
          take: 1,
        },
      },
    })

    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }

    const subscription = user.subscriptions[0]
    const plan = plans[user.billingTier.toLowerCase() as keyof typeof plans]

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        billingTier: user.billingTier,
      },
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      } : null,
      plan,
      hasPaymentMethod: user.paymentMethods.length > 0,
    }
  })

  // Create checkout session
  fastify.post('/checkout', {
    preHandler: [fastify.authenticate],
    schema: {
      body: z.object({
        billingTier: z.enum(['STARTER', 'PRO', 'ENTERPRISE']),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }),
    },
  }, async (request, reply) => {
    const { billingTier, successUrl, cancelUrl } = request.body
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    })

    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }

    const plan = plans[billingTier.toLowerCase() as keyof typeof plans]
    
    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      stripeCustomerId = customer.id
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: plan.price,
            product_data: {
              name: plan.name,
              description: plan.description,
              images: [],
            },
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        billingTier,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          billingTier,
        },
      },
    })

    return { sessionId: session.id, url: session.url }
  })

  // Create customer portal session
  fastify.post('/portal', {
    preHandler: [fastify.authenticate],
    schema: {
      body: z.object({
        returnUrl: z.string().url(),
      }),
    },
  }, async (request, reply) => {
    const { returnUrl } = request.body
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    })

    if (!user || !user.stripeCustomerId) {
      reply.code(404).send({ error: 'Customer not found' })
      return
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  })

  // Cancel subscription
  fastify.post('/subscription/cancel', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!user || !user.subscriptions[0]) {
      reply.code(404).send({ error: 'No active subscription found' })
      return
    }

    const subscription = user.subscriptions[0]

    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    })

    return { message: 'Subscription will be canceled at period end' }
  })

  // Get usage statistics
  fastify.get('/usage', {
    preHandler: [fastify.authenticate],
    schema: {
      querystring: z.object({
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      }),
    },
  }, async (request, reply) => {
    const { startDate, endDate } = request.query
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    })

    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }

    const where = {
      userId: user.id,
      ...(startDate && { timestamp: { gte: new Date(startDate) } }),
      ...(endDate && { timestamp: { lte: new Date(endDate) } }),
    }

    const usage = await prisma.usageRecord.groupBy({
      by: ['metric'],
      where,
      _sum: {
        quantity: true,
      },
    })

    const plan = plans[user.billingTier.toLowerCase() as keyof typeof plans]

    return {
      usage: usage.map((record) => ({
        metric: record.metric,
        quantity: record._sum.quantity || 0,
      })),
      limits: plan.limits,
      billingTier: user.billingTier,
    }
  })

  // Get invoices
  fastify.get('/invoices', {
    preHandler: [fastify.authenticate],
    schema: {
      querystring: z.object({
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
      }),
    },
  }, async (request, reply) => {
    const { limit, offset } = request.query
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
    })

    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.invoice.count({
        where: { userId: user.id },
      }),
    ])

    return {
      invoices,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    }
  })

  // Get available plans
  fastify.get('/plans', async (request, reply) => {
    return Object.entries(plans).map(([key, plan]) => ({
      id: key.toUpperCase(),
      ...plan,
    }))
  })
}

export default billingRoutes