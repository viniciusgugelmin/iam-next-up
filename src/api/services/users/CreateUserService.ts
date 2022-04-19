import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import AppError from "../../../errors/AppError";
import { getCommonRole } from "../../models/Role";
import User from "../../models/User";

export default class CreateUserService {
  public async execute({
    user,
    newUser,
  }: {
    user: IUser;
    newUser: any;
  }): Promise<IUser> {
    const usersRepository = new UsersRepository();
    usersRepository.checkIfHasPermission(user, "users", "create");

    const { db } = await connectMongoDB();

    const _newUser = new User();
    for (const key in newUser) {
      if (newUser[key]) {
        // @ts-ignore
        _newUser[key] = newUser[key];
      }
    }

    _newUser.document = usersRepository.removeDotsAndSlashesFromDocument(
      newUser.document
    );

    const hasUserWithSameDocumentOrEmail = await db
      .collection(usersRepository.collection)
      .findOne({
        $or: [{ document: _newUser.document }, { email: _newUser.email }],
      });

    if (hasUserWithSameDocumentOrEmail) {
      throw new AppError("Document or email already in use");
    }

    if (_newUser.role.name !== getCommonRole().name) {
      try {
        usersRepository.checkIfHasPermission(user, "admin_users", "create");
      } catch (error) {
        throw new AppError(
          "You don't have permission to create a user with this role"
        );
      }
    }

    _newUser.role = await usersRepository.checkAndGetIfUserRoleExists(
      db,
      _newUser.role.name
    );

    _newUser.password = await usersRepository.hashPassword(_newUser.password);

    await db.collection(usersRepository.collection).insertOne({ ..._newUser });

    return _newUser;
  }
}
