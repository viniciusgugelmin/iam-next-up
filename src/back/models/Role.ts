import IRole from "../../interfaces/models/IRole";

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

  // Getters and Setters

  public get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // Functions

  public delete() {
    this._deletedAt = new Date();

    return {
      _deletedAt: this._deletedAt,
    };
  }

  public reactivate() {
    this._deletedAt = null;

    return {
      _deletedAt: this._deletedAt,
    };
  }
}
