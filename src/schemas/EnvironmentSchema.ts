import { z } from "zod";

export default z.object({
  JWT_SECRET: z.string().trim().min(1),
  PORT: z.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().trim().min(1),
  REDIS_URL: z.string().trim().min(1),
});
