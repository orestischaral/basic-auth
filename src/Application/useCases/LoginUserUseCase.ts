import { IUserRepository } from "../../Domain/IRepositories/IUserRepository";
import { comparePassword } from "../../Infrastructure/auth_utils/password";
import { generateToken } from "../../Infrastructure/auth_utils/jwt";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const creds = await this.userRepository.getUserCredential(user.id);
    if (!creds) throw new Error("No credentials found");

    const valid = await comparePassword(password, creds.password);
    if (!valid) throw new Error("Invalid credentials");

    return generateToken({ id: user.id, email });
  }
}
