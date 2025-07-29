import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../Domain/IRepositories/IUserRepository";

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async createUserAccount(email: string) {
    const user = await prisma.userAccount.create({
      data: {
        email,
        provider: "local",
        providerUserId: email,
      },
    });
    return { id: user.id };
  }

  async createUserCredential(userId: string, hashedPassword: string) {
    await prisma.userCredential.create({
      data: {
        userId,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await prisma.userAccount.findFirst({
      where: {
        email,
      },
    });

    if (!user) return null;
    return { id: user.id };
  }

  async getUserCredential(userId: string) {
    const creds = await prisma.userCredential.findUnique({
      where: { userId },
    });

    if (!creds) return null;
    return { password: creds.password };
  }
}
