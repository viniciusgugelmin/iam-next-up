import IRole from "../../interfaces/IRole";

export default class Role implements IRole {
  name;
  description;
  permissions;

  constructor(role: IRole) {
    this.name = role.name;
    this.description = role.description;
    this.permissions = role.permissions;
  }
}
