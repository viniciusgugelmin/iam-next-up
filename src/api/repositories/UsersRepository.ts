import { hash } from "bcryptjs";
import AppError from "../../errors/AppError";
import { Db } from "mongodb";
import { RolesRepository } from "./RolesRepository";
import IRole from "../../interfaces/IRole";

export class UsersRepository {
  collection = "users";

  public async checkAndGetIfUserRoleExists(
    db: Db,
    userRoleName: string
  ): Promise<IRole> {
    const rolesRepository = new RolesRepository();
    const roles = await db
      .collection(rolesRepository.collection)
      .find({})
      .toArray();

    const userRole = await rolesRepository.getRole(roles, userRoleName);

    if (!userRole) {
      throw new AppError("Role not found", 422);
    }

    return userRole;
  }

  public async updateUsersWithItsRole(db: Db, role: IRole) {
    await db
      .collection(this.collection)
      .updateMany({ "role.name": role.name }, { $set: { role: { ...role } } });
  }

  public async hashPassword(password: string): Promise<string> {
    return await hash(password, 8);
  }
}
