import IUser from "../../interfaces/IUser";
import IRole from "../../interfaces/IRole";
import { getCommonRole } from "./Role";

export default class User implements IUser {
  document = "";
  email = "";
  name = "";
  password = "";
  active = true;
  statusDescription = null;
  private _gender = "";
  hiredAt = new Date();
  role: IRole | { name: string } = { name: getCommonRole().name };
  createdAt = new Date();
  updatedAt = new Date();
  deletedAt = null;

  get gender(): string {
    return this._gender;
  }

  set gender(value: string) {
    let _value = value;

    if (!genderOptions.includes(value)) {
      _value = "Prefer not to say";
    }

    this._gender = _value;
  }
}

export const genderOptions = [
  "Male",
  "Female",
  "Transgender",
  "Non-binary",
  "Prefer not to say",
];
