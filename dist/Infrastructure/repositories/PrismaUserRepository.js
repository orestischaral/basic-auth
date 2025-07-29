"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrismaUserRepository {
    async createUserAccount(email) {
        const user = await prisma.userAccount.create({
            data: {
                email,
                provider: "local",
                providerUserId: email,
            },
        });
        return { id: user.id };
    }
    async createUserCredential(userId, hashedPassword) {
        await prisma.userCredential.create({
            data: {
                userId,
                password: hashedPassword,
            },
        });
    }
    async findByEmail(email) {
        const user = await prisma.userAccount.findFirst({
            where: {
                email,
            },
        });
        if (!user)
            return null;
        return { id: user.id };
    }
    async getUserCredential(userId) {
        const creds = await prisma.userCredential.findUnique({
            where: { userId },
        });
        if (!creds)
            return null;
        return { password: creds.password };
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
