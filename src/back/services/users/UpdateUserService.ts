import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import AppError from "../../../errors/AppError";
import User from "../../models/User";
import commonRole from "../../../constants/roles/commonRole";

interface IRequest {
  user: IUser;
  userToUpdate: any;
  userToUpdateData: any;
}

export default class UpdateUserService {
  public async execute({
    user,
    userToUpdate,
    userToUpdateData,
  }: IRequest): Promise<Object> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "update");

    const { db } = await connectMongoDB();

    const _userToUpdate = new User();
    for (const key in userToUpdateData) {
      if (userToUpdateData[key]) {
        // @ts-ignore
        _userToUpdate[key] = userToUpdateData[key];
      }
    }

    _userToUpdate.document = usersRepository.removeDotsAndSlashesFromDocument(
      userToUpdateData.document
    );

    if (
      _userToUpdate.document === "00000000000" &&
      user.document !== "00000000000"
    ) {
      throw new AppError("Only the admin can update the admin user", 401);
    }

    const hasUserWithSameDocumentOrEmail = await db
      .collection(usersRepository.collection)
      .findOne({
        $and: [
          { _deletedAt: null },
          {
            $or: [
              { document: _userToUpdate.document },
              { email: _userToUpdate.email },
            ],
          },
        ],
      });

    if (
      hasUserWithSameDocumentOrEmail &&
      hasUserWithSameDocumentOrEmail.document === _userToUpdate.document &&
      hasUserWithSameDocumentOrEmail.document !== _userToUpdate.document
    ) {
      throw new AppError("Document already in use", 400);
    }

    if (
      hasUserWithSameDocumentOrEmail &&
      hasUserWithSameDocumentOrEmail.email === _userToUpdate.email &&
      hasUserWithSameDocumentOrEmail.email !== userToUpdate.email
    ) {
      throw new AppError("Email already in use", 400);
    }

    if (
      _userToUpdate.role.name !== userToUpdate.role.name &&
      _userToUpdate.role.name !== commonRole.name
    ) {
      try {
        usersRepository.checkIfHasPermission(user, "admin_users", "update");
      } catch (error) {
        throw new AppError(
          "You don't have permission to update a user with this role"
        );
      }
    }

    _userToUpdate.role = await usersRepository.checkAndGetIfUserRoleExists(
      db,
      _userToUpdate.role.name
    );

    _userToUpdate.password = await usersRepository.hashPassword(
      _userToUpdate.password
    );

    await db.collection(usersRepository.collection).updateOne(
      { _id: userToUpdate._id },
      {
        $set: {
          ..._userToUpdate,
          _createdAt: userToUpdate._createdAt,
        },
      }
    );

    return {
      ..._userToUpdate,
      _createdAt: userToUpdate._createdAt,
    };
  }
}
