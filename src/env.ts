import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+)$/
const zDomain = z.string().min(1).regex(domainRegex, {
  message: 'Invalid domain format',
})

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    PAYLOAD_SECRET: z.string().min(1),
    PAYLOAD_PUBLIC_DRAFT_SECRET: z.string().min(1),
    NEXT_PRIVATE_DRAFT_SECRET: z.string().min(1),
    REVALIDATION_KEY: z.string().min(1),
    NEXT_PRIVATE_REVALIDATION_KEY: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    NEXT_PUBLIC_VERCEL_URL: zDomain.optional(),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: zDomain.optional(),
    NEXT_PUBLIC_IS_LIVE: z.enum(['true', 'false']),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PAYLOAD_PUBLIC_DRAFT_SECRET: process.env.PAYLOAD_PUBLIC_DRAFT_SECRET,
    NEXT_PRIVATE_DRAFT_SECRET: process.env.NEXT_PRIVATE_DRAFT_SECRET,
    REVALIDATION_KEY: process.env.REVALIDATION_KEY,
    NEXT_PRIVATE_REVALIDATION_KEY: process.env.NEXT_PRIVATE_REVALIDATION_KEY,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    NEXT_PUBLIC_IS_LIVE: process.env.NEXT_PUBLIC_IS_LIVE,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  },
})

if (env.NEXT_PUBLIC_VERCEL_ENV === 'production' && !env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
  throw new Error('NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL is required in production')
}
if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && !env.NEXT_PUBLIC_VERCEL_URL) {
  throw new Error('NEXT_PUBLIC_VERCEL_URL is required in preview')
}

export const SERVER_URL =
  env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
      : `http://localhost:3000`
