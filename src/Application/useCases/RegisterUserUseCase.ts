import { IUserRepository } from "../../Domain/IRepositories/IUserRepository";
import { hashPassword } from "../../Infrastructure/auth_utils/password";
import { generateToken } from "../../Infrastructure/auth_utils/jwt";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const { id } = await this.userRepository.createUserAccount(email);
    const hashed = await hashPassword(password);
    await this.userRepository.createUserCredential(id, hashed);

    return generateToken({ id, email });
  }
}
