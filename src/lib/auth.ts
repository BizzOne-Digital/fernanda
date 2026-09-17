import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { env } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { authConfig } from "@/lib/auth.config";

const LOGIN_RATE_LIMIT = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: env.authSecret,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const ip = request?.headers ? getClientIp(request.headers) : "unknown";
        const limitKey = `login:${ip}:${email}`;
        const limited = checkRateLimit(limitKey, {
          limit: LOGIN_RATE_LIMIT,
          windowMs: LOGIN_WINDOW_MS,
        });

        if (!limited.allowed) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        await connectMongo();

        const admin = await AdminUser.findOne({ email });
        if (!admin) {
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          return null;
        }

        await AdminUser.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: "admin",
        };
      },
    }),
  ],
});
