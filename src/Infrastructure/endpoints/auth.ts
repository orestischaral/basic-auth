// src/Infrastructure/endpoints/auth.ts
import express from "express";
import passport from "passport";
import { generateToken } from "../auth_utils/jwt";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { RegisterUserUseCase } from "../../Application/useCases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../Application/useCases/LoginUserUseCase";

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

export default router;
