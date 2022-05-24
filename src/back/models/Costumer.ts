import ICostumer from "../../interfaces/models/ICostumer";

export default class Costumer implements ICostumer {
  document = "";
  email = "";
  name = "";
  password = "";
  private _birthday = new Date();
  private _createdAt = new Date();
  private _updatedAt = new Date();
  private _deletedAt: Date | null = null;

  // Getters and Setters

  public get birthday(): Date {
    return this._birthday;
  }

  public set birthday(value: Date) {
    this._birthday = new Date(value);
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

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
