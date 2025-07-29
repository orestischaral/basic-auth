"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/Infrastructure/auth_utils/googleStrategy.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
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
    }
    catch (err) {
        done(err, undefined);
    }
}));
