// src/Infrastructure/auth_utils/googleStrategy.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0].value;
      const name = profile.name;
      const displayName = profile.displayName;
      const providerUserId = profile.id;
      const provider = "google";
      if (!email) {
        return done(new Error("No email found"), undefined);
      }

      try {
        let account = await prisma.userAccount.findUnique({
          where: {
            provider_providerUserId: {
              provider,
              providerUserId,
            },
          },
        });

        if (!account) {
          account = await prisma.userAccount.create({
            data: {
              provider,
              providerUserId,
              email,
              name: name?.givenName,
              familyName: name?.familyName,
              displayName: displayName,
            },
          });
        }

        done(null, { id: account.id, email: account.email });
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);
