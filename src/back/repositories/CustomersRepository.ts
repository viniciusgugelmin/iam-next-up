import { hash } from "bcryptjs";

export class CustomersRepository {
  collection = "customers";

  public async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
