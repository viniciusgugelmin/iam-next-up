import IPermission from "./IPermission";

export default interface IRole {
  _id?: string;
  name: string;
  description?: string;
  permissions?: IPermission[];
  deletedAt: Date | null;
}
