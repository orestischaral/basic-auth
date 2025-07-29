export interface IUserRepository {
  createUserAccount(email: string): Promise<{ id: string }>;
  createUserCredential(userId: string, hashedPassword: string): Promise<void>;
  findByEmail(email: string): Promise<{ id: string } | null>;
  getUserCredential(userId: string): Promise<{ password: string } | null>;
}
