// src/Infrastructure/endpoints/auth.ts
import express from "express";
import passport from "passport";
import redis from "../db_utils/redis";
import jwt from "jsonwebtoken";
import { generateToken } from "../auth_utils/jwt";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { RegisterUserUseCase } from "../../Application/useCases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../Application/useCases/LoginUserUseCase";
import { withAuth } from "../auth_utils/authMiddleware";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const user = req.user as { id: string; email: string };
    const token = generateToken({ id: user.id, email: user.email });

    res.json({ token });
  }
);

const userRepo = new PrismaUserRepository();
const registerUseCase = new RegisterUserUseCase(userRepo);

router.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const token = await registerUseCase.execute(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

const loginUseCase = new LoginUserUseCase(userRepo);

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const token = await loginUseCase.execute(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
});

router.post(
  "/auth/logout",
  withAuth(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.decode(token!) as any;

    if (!decoded || !decoded.exp) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const ttl = decoded.exp - Math.floor(Date.now() / 1000); // In seconds
    if (ttl > 0) {
      await redis.set(`bl:${token}`, "1", "EX", ttl);
    }

    res.json({ message: "Logged out successfully" });
  })
);

export default router;
