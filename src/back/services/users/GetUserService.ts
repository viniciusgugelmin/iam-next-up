import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";

interface IRequest {
  user: IUser;
  userId: string;
  returnPassword?: boolean;
}

export default class GetUserService {
  public async execute({
    user,
    userId,
    returnPassword = false,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "read");

    try {
      const { db } = await connectMongoDB();
      const userToReturn = await db
        .collection(usersRepository.collection)
        .findOne({ _id: new ObjectId(userId) });

      if (!userToReturn) {
        throw new Error();
      }

      !returnPassword && delete userToReturn.password;

      return userToReturn;
    } catch (error) {
      throw new AppError("User not found", 404);
    }
  }
}
