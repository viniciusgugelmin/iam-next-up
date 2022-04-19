import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import AppError from "../../../errors/AppError";
import { getCommonRole } from "../../models/Role";
import User from "../../models/User";

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
      _userToUpdate.role.name !== getCommonRole().name
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
