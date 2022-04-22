import IRole from "../../interfaces/IRole";

export default class Role implements IRole {
  name;
  description;
  permissions;
  private _deletedAt: Date | null = null;

  constructor(role: IRole) {
    this.name = role.name;
    this.description = role.description;
    this.permissions = role.permissions;
  }

  public get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
