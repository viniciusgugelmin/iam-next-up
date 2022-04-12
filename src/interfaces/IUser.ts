import IRole from "./IRole";

export default interface IUser {
  _id: string;
  document: string;
  name: string;
  email: string;
  password: string;
  status: boolean;
  statusDescription: string | null;
  gender: string;
  role: IRole;
  hiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserAuth {
  token: string;
}
