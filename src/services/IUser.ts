export default interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserAuth {
  token: string;
}
