import IPermission from "./IPermission";

export default interface IRole {
  name: string;
  description?: string;
  permissions?: IPermission[];
}
