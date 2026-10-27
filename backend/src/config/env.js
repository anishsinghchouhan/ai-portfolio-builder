import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root folder
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Zod schema to validate environment variables at startup
const envSchema = z
  .object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    CORS_ORIGIN: z.string().optional(),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DIRECT_URL: z.string().optional(),
    SUPABASE_URL: z.string().min(1, "SUPABASE_URL is required"),
    SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
    GEMINI_API_KEY: z.string().optional(),
  })
  .refine(
    (data) => {
      // In production mode, CORS_ORIGIN is strictly required and cannot be empty
      if (data.NODE_ENV === "production") {
        return Boolean(data.CORS_ORIGIN && data.CORS_ORIGIN.trim().length > 0);
      }
      return true;
    },
    {
      message: "CORS_ORIGIN is strictly required in production mode",
      path: ["CORS_ORIGIN"],
    }
  );

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n❌ [FATAL] Environment Configuration Validation Failed at Startup:");
  parsed.error.issues.forEach((issue) => {
    console.error(`   - Missing/Invalid '${issue.path.join(".")}': ${issue.message}`);
  });
  console.error("   Please check your backend/.env configuration file.\n");
  // Strictly exit process in ALL environments on validation failure
  process.exit(1);
}

// In development, default CORS_ORIGIN to localhost Vite dev server if omitted
const validatedEnv = {
  ...parsed.data,
  CORS_ORIGIN: parsed.data.CORS_ORIGIN || "http://localhost:5173",
};

export const env = validatedEnv;
export default env;
