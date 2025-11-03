import { z } from 'zod'

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  JWT_SECRET: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
})

export type Config = z.infer<typeof configSchema>

export const plans = {
  free: {
    name: 'Free',
    description: 'Perfect for trying out Ultra DevBox',
    price: 0,
    features: [
      '1 workspace',
      '2 CPU cores',
      '4GB RAM',
      '20GB storage',
      'Community support',
    ],
    limits: {
      maxWorkspaces: 1,
      maxCpu: 2,
      maxMemory: 4, // GB
      maxDisk: 20, // GB
      maxGpu: 0,
    },
  },
  starter: {
    name: 'Starter',
    description: 'For individual developers and small projects',
    price: 2900, // $29/month in cents
    features: [
      '5 workspaces',
      '4 CPU cores',
      '8GB RAM',
      '50GB storage',
      'Email support',
      'AI assistant (CodeLlama 13B)',
    ],
    limits: {
      maxWorkspaces: 5,
      maxCpu: 4,
      maxMemory: 8,
      maxDisk: 50,
      maxGpu: 0,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For professional developers and teams',
    price: 9900, // $99/month in cents
    features: [
      'Unlimited workspaces',
      '8 CPU cores',
      '16GB RAM',
      '100GB storage',
      'Priority support',
      'Advanced AI models',
      'GPU support (1x T4)',
      'Team collaboration',
    ],
    limits: {
      maxWorkspaces: -1, // Unlimited
      maxCpu: 8,
      maxMemory: 16,
      maxDisk: 100,
      maxGpu: 1,
    },
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large teams and organizations',
    price: 29900, // $299/month in cents
    features: [
      'Unlimited everything',
      '16 CPU cores',
      '32GB RAM',
      '500GB storage',
      'Dedicated support',
      'All AI models',
      'Multi-GPU support',
      'Advanced security',
      'Custom integrations',
      'SLA guarantee',
    ],
    limits: {
      maxWorkspaces: -1, // Unlimited
      maxCpu: 16,
      maxMemory: 32,
      maxDisk: 500,
      maxGpu: 2,
    },
  },
}

export const billingTiers = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const

export type BillingTier = keyof typeof billingTiers

export const usageMetrics = {
  CPU_HOURS: 'cpu_hours',
  MEMORY_GB_HOURS: 'memory_gb_hours',
  STORAGE_GB_HOURS: 'storage_gb_hours',
  GPU_HOURS: 'gpu_hours',
  NETWORK_GB: 'network_gb',
  API_CALLS: 'api_calls',
  WORKSPACE_COUNT: 'workspace_count',
} as const

export type UsageMetric = keyof typeof usageMetrics