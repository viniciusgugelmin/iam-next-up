import IUser from "../../interfaces/IUser";
import IRole from "../../interfaces/IRole";
import { getCommonRole } from "./Role";

export default class User implements IUser {
  document = "";
  email = "";
  name = "";
  password = "";
  private _active = true;
  private _statusDescription: string | null = null;
  private _gender = "";
  private _hiredAt = new Date();
  role: IRole | { name: string } = { name: getCommonRole().name };
  private _createdAt = new Date();
  private _updatedAt = new Date();
  private _deletedAt: Date | null = null;

  // Getters and Setters

  public get active(): boolean {
    return this._active;
  }

  public get statusDescription(): string | null {
    return this._statusDescription;
  }

  public get gender(): string {
    return this._gender;
  }

  public set gender(value: string) {
    let _value = value;

    if (!genderOptions.includes(value)) {
      _value = "Prefer not to say";
    }

    this._gender = _value;
  }

  public get hiredAt(): Date {
    return this._hiredAt;
  }

  public set hiredAt(value: Date) {
    this._hiredAt = new Date(value);
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

  public deactivate(statusDescription: string) {
    this._active = false;
    this._statusDescription = statusDescription;
  }

  public delete() {
    this._active = false;
    this._statusDescription = "Deleted";
    this._deletedAt = new Date();
  }

  public reactivate() {
    this._active = true;
    this._statusDescription = null;
    this._deletedAt = null;
  }
}

export const genderOptions = [
  "Male",
  "Female",
  "Transgender",
  "Non-binary",
  "Prefer not to say",
];
