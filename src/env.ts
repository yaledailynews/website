import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
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
    NEXT_PUBLIC_SERVER_URL: z.string().min(1),
    NEXT_PUBLIC_IS_LIVE: z.enum(["true", "false"]),
  },
  runtimeEnv: {
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PAYLOAD_PUBLIC_DRAFT_SECRET: process.env.PAYLOAD_PUBLIC_DRAFT_SECRET,
    NEXT_PRIVATE_DRAFT_SECRET: process.env.NEXT_PRIVATE_DRAFT_SECRET,
    REVALIDATION_KEY: process.env.REVALIDATION_KEY,
    NEXT_PRIVATE_REVALIDATION_KEY: process.env.NEXT_PRIVATE_REVALIDATION_KEY,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_IS_LIVE: process.env.NEXT_PUBLIC_IS_LIVE
  },
})