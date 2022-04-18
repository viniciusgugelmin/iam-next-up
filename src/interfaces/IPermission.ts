export default interface IPermission {
  name: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
