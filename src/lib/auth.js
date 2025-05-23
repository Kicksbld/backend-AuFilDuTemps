import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { bearer } from "better-auth/plugins";

const prisma = new PrismaClient();

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [bearer()],
  trustedOrigins: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  emailAndPassword: {
    enabled: true
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseUrl: process.env.BETTER_AUTH_URL || 'https://backend-au-fil-du-temps.vercel.app',
  advanced: {
    defaultCookieAttributes:
      process.env.NODE_ENV === 'production'
        ? {
          sameSite: 'none',
          secure: true
        }
        : undefined
  },
});

export { auth };
