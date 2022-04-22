import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import { ObjectId } from "mongodb";
import AppError from "../../../errors/AppError";
import User from "../../models/User";

interface IRequest {
  user: IUser;
  userId: string;
}

export default class DeleteUserService {
  public async execute({ user, userId }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "delete");

    const { db } = await connectMongoDB();
    const userToDelete = await db
      .collection(usersRepository.collection)
      .findOne({ _id: new ObjectId(userId) });

    if (!userToDelete) {
      throw new AppError("User not found", 404);
    }

    if (userToDelete.document === "00000000000") {
      throw new AppError("This user can't be deleted", 401);
    }

    if (!userToDelete._active) {
      throw new AppError("User already deleted", 404);
    }

    try {
      if (userToDelete.role.name === "admin") {
        usersRepository.checkIfHasPermission(user, "admin_users", "delete");
      }
    } catch (error) {
      throw new AppError("You don't have permission to delete this user", 403);
    }

    const deletedUserData = new User();

    await db.collection(usersRepository.collection).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: deletedUserData.delete(),
      }
    );

    return userToDelete;
  }
}
