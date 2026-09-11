function readEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value !== undefined && value !== "") {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`Missing required environment variable: ${key}`);
}

function readOptionalEnv(key: string, fallback = ""): string {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : fallback;
}

function readNumberEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === "") {
    return fallback;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
}

export const env = {
  mongodbUri: readEnv(
    "MONGODB_URI",
    "mongodb://127.0.0.1:27017/vaseaux_lake_rentals",
  ),
  authSecret: readEnv("AUTH_SECRET", "development-auth-secret-change-me"),
  adminEmail: readEnv("ADMIN_EMAIL", "admin@vaseauxlake.local"),
  adminPassword: readEnv("ADMIN_PASSWORD", "replace-this-before-production"),
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  uploadDir: readEnv("UPLOAD_DIR", "./uploads"),
  maxUploadBytes: readNumberEnv("MAX_UPLOAD_BYTES", 12_582_912),
  smtp: {
    host: readOptionalEnv("SMTP_HOST"),
    port: readOptionalEnv("SMTP_PORT"),
    user: readOptionalEnv("SMTP_USER"),
    password: readOptionalEnv("SMTP_PASSWORD"),
    from: readOptionalEnv("SMTP_FROM"),
  },
  bookingNotificationEmail: readOptionalEnv(
    "BOOKING_NOTIFICATION_EMAIL",
    "vaseauxlakecabins@gmail.com",
  ),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

export type Env = typeof env;
