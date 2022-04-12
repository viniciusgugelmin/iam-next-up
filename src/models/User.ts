import IUser from "../interfaces/IUser";
import IRole from "../interfaces/IRole";

export const genderOptions = [
  "Male",
  "Female",
  "Transgender",
  "Non-binary",
  "Prefer not to say",
];

const roleOptions: IRole[] = [
  {
    name: "admin",
    description: "Administrator",
    permission: 10,
  },
  {
    name: "user",
    description: "Common",
    permission: 0,
  },
];

export default class User implements IUser {
  _id = "";
  document = "";
  email = "";
  name = "";
  password = "";
  status = true;
  statusDescription = null;
  private _gender = "";
  hiredAt = new Date();
  private _role: IRole = {
    name: "",
    description: "",
    permission: 0,
  };
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

  get role(): IRole {
    return this._role;
  }

  set role(value: IRole) {
    let _value = value;

    if (
      !roleOptions.find(
        (role) =>
          role.name === value.name &&
          role.description === value.description &&
          role.permission === value.permission
      )
    ) {
      _value = {
        name: "user",
        description: "Common",
        permission: 0,
      };
    }

    this._role = _value;
  }
}
