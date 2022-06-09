export default interface ICustomer {
  _id?: string;
  document: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ICostumerLogin {
  email: string;
  password: string;
}

export interface ICostumerAuth {
  token: string;
}
