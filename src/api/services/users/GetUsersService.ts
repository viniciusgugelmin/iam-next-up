import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";

interface IRequest {
  user: IUser;
}

export default class GetUsersService {
  public async execute({ user }: IRequest): Promise<Object[]> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "read");

    const { db } = await connectMongoDB();
    const users = await db
      .collection(usersRepository.collection)
      .find({ _active: true })
      .toArray();

    users.map((user) => {
      delete user.password;
    });

    return users;
  }
}
