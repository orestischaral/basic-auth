"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const password_1 = require("../../Infrastructure/auth_utils/password");
const jwtAuth_1 = require("../../Infrastructure/auth_utils/jwtAuth");
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const creds = await this.userRepository.getUserCredential(user.id);
        if (!creds)
            throw new Error("No credentials found");
        const valid = await (0, password_1.comparePassword)(password, creds.password);
        if (!valid)
            throw new Error("Invalid credentials");
        return (0, jwtAuth_1.generateToken)({ id: user.id, email });
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
