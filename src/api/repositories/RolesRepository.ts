import IRole from "../../interfaces/IRole";

export class RolesRepository {
  collection = "roles";

  public async getRole(roles: any, roleName: string): Promise<IRole> {
    return (roles as IRole[]).find((role) => role.name === roleName) as IRole;
  }
}
