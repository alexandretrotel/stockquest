import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { passkey } from "better-auth/plugins/passkey";
import {
  BASE_URL,
  DEV,
  MAXIMUM_PASSWORD_LENGTH,
  MAXIMUM_USERNAME_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  MINIMUM_USERNAME_LENGTH,
} from "../data/settings";
import { username, admin, anonymous } from "better-auth/plugins";
import { sendAuthEmail } from "@/actions/emails.action";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: MINIMUM_PASSWORD_LENGTH,
    maxPasswordLength: MAXIMUM_PASSWORD_LENGTH,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendAuthEmail({
          to: user.email,
          subject: "Reset your password",
          text: `Click the link to reset your password.`,
          url,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendAuthEmail({
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email.`,
          url,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  plugins: [
    passkey({
      rpID: DEV ? "localhost" : "stockquest.app",
      rpName: "StockQuest",
      origin: BASE_URL,
    }),
    username({
      minUsernameLength: MINIMUM_USERNAME_LENGTH,
      maxUsernameLength: MAXIMUM_USERNAME_LENGTH,
    }),
    admin(),
    anonymous(),
  ],
});
