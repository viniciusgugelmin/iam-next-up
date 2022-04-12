import { hash } from "bcryptjs";

export class UsersRepository {
  collection = "users";

  public async hashPassword(password: string): Promise<string> {
    return await hash(password, 8);
  }
}
