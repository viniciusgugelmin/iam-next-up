import IPermission from "../../interfaces/IPermission";

export default class Permission implements IPermission {
  name;
  create;
  read;
  update;
  delete;

  constructor(permission: IPermission) {
    this.name = permission.name;
    this.create = permission.create;
    this.read = permission.read;
    this.update = permission.update;
    this.delete = permission.delete;
  }
}

export const changeRolePermission = (
  permissions: IPermission[],
  permission: IPermission
) => [
  ...permissions.map((p) => {
    if (p.name === permission.name) {
      return {
        name: p.name,
        create: permission.create,
        read: permission.read,
        update: permission.update,
        delete: permission.delete,
      };
    }

    return p;
  }),
];

export const getAllPermissions = () => [
  new Permission({
    name: "user",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "customer",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "product",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "roles",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
];
