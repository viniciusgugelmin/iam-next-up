import { hash } from "bcryptjs";
import { Collection } from "mongodb";
import { mongoDatabase } from "../api/config/mongoDatabase";

export class UsersRepositories {
  public collection: Collection | undefined;

  public async call(callback: Function) {
    await mongoDatabase.openInstance();
    this.collection = mongoDatabase.db?.collection("users");
    const response = await callback();
    await mongoDatabase.closeInstance();

    return response;
  }

  public async hashPassword(password: string): Promise<string> {
    return await hash(password, 8);
  }
}
