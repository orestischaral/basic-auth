"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/Infrastructure/endpoints/auth.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jwtAuth_1 = require("./../auth_utils/jwtAuth");
const PrismaUserRepository_1 = require("../repositories/PrismaUserRepository");
const RegisterUserUseCase_1 = require("../../Application/useCases/RegisterUserUseCase");
const LoginUserUseCase_1 = require("../../Application/useCases/LoginUserUseCase");
const router = express_1.default.Router();
router.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    session: false,
}), (req, res) => {
    const user = req.user;
    const token = (0, jwtAuth_1.generateToken)({ id: user.id, email: user.email });
    res.json({ token });
});
const userRepo = new PrismaUserRepository_1.PrismaUserRepository();
const registerUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepo);
router.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }
    try {
        const token = await registerUseCase.execute(email, password);
        res.json({ token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
const loginUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepo);
router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }
    try {
        const token = await loginUseCase.execute(email, password);
        res.json({ token });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
});
exports.default = router;
