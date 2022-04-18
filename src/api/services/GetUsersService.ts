import connectMongoDB from "../config/mongoDatabase";
import { UsersRepository } from "../repositories/UsersRepository";
import AppError from "../../errors/AppError";
import IUser from "../../interfaces/IUser";

export default class GetUsersService {
  public async execute({ user }: { user: IUser }): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "user", "read");

    const { db } = await connectMongoDB();
    const users = await db
      .collection(usersRepository.collection)
      .find({ _active: true })
      .toArray();

    if (users.length > 0) {
      users.map((user) => {
        delete user.password;
      });
    }

    return users;
  }
}
