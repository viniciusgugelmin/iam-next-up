import { hash } from "bcryptjs";
import AppError from "../../errors/AppError";
import { Db } from "mongodb";
import { RolesRepository } from "./RolesRepository";
import IRole from "../../interfaces/IRole";
import IUser from "../../interfaces/IUser";
import adminRole from "../../constants/roles/adminRole";

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

  public checkIfHasPermission(
    user: IUser,
    permissionName: string,
    permissionValue: string
  ) {
    if (
      user.role.name === adminRole.name ||
      user.role.permissions?.find(
        (permission) =>
          // @ts-ignore
          permission.name === permissionName && permission[permissionValue]
      )
    )
      return;

    throw new AppError(
      "You don't have permission to access this resource",
      403
    );
  }

  public removeDotsAndSlashesFromDocument(document: string) {
    return document.replace(/[\s-.]/g, "");
  }

  public async hashPassword(password: string): Promise<string> {
    return await hash(password, 8);
  }
}
