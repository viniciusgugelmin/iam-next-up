import connectMongoDB from "../../config/mongoDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";
import IUser from "../../../interfaces/IUser";
import AppError from "../../../errors/AppError";
import User from "../../models/User";
import commonRole from "../../../constants/roles/commonRole";

interface IRequest {
  user: IUser;
  newUser: any;
}

export default class CreateUserService {
  public async execute({ user, newUser }: IRequest): Promise<IUser> {
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
        $and: [
          { _deletedAt: null },
          { $or: [{ document: _newUser.document }, { email: _newUser.email }] },
        ],
      });

    if (
      hasUserWithSameDocumentOrEmail &&
      hasUserWithSameDocumentOrEmail.document === _newUser.document
    ) {
      throw new AppError("Document already in use", 400);
    }

    if (
      hasUserWithSameDocumentOrEmail &&
      hasUserWithSameDocumentOrEmail.email === _newUser.email
    ) {
      throw new AppError("Email already in use", 400);
    }

    if (_newUser.role.name !== commonRole.name) {
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

    await db.collection(usersRepository.collection).insertOne(_newUser);

    return _newUser;
  }
}
