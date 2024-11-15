import { z } from "zod";

const clientEnvSchema = z.object({
  VITE_MEILI_URL: z.string().url(),
  VITE_MEILI_SEARCH_KEY: z.string().min(1),
  VITE_MEILI_SEARCH_INDEX: z.string().min(1),
  VITE_S3_URL: z.string().url(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
