"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const password_1 = require("../../Infrastructure/auth_utils/password");
const jwtAuth_1 = require("../../Infrastructure/auth_utils/jwtAuth");
class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new Error("Email already in use");
        }
        const { id } = await this.userRepository.createUserAccount(email);
        const hashed = await (0, password_1.hashPassword)(password);
        await this.userRepository.createUserCredential(id, hashed);
        return (0, jwtAuth_1.generateToken)({ id, email });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
