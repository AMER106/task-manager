import "dotenv/config";
import { z } from "zod";
export const envSchema = z.object({
  DB_URL: z.string().min(10, { message: "DB_URL is required" }),
  JWT_SECRET: z.string(),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  console.error("❌ Invalid environment variables:");
  process.exit(1);
}

export default env;
