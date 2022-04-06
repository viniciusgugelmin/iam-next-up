import { hash } from "bcryptjs";
import IUser from "../services/IUser";

export class UsersRepositories {
  public async find(id: string): Promise<IUser | undefined> {
    if (id !== "1") return;

    return {
      id: "1",
      name: "Admin",
      email: "admin@admin.com",
      password: await hash("123", 8),
      roles: ["admin"],
    };
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    if (email !== "admin@admin.com") return;

    return {
      id: "1",
      name: "Admin",
      email: "admin@admin",
      password: await hash("123", 8),
      roles: ["admin"],
    };
  }
}
