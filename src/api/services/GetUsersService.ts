import { UsersRepository } from "../../repositories/UsersRepository";
import connectMongoDB from "../config/mongoDatabase";

export default class GetUsersService {
  public async execute(): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    const { db } = await connectMongoDB();
    const users = await db
      .collection(usersRepository.collection)
      .find({ status: true })
      .toArray();

    if (users.length > 0) {
      users.map((user) => {
        delete user.password;
      });
    }

    return users;
  }
}
