import IRole from "../../interfaces/IRole";
import { getAllPermissions } from "./Permission";

export default class Role implements IRole {
  name;
  description;
  permissions;

  constructor(role: IRole) {
    this.name = role.name;
    this.description = role.description;
    this.permissions = role.permissions;
  }
}

export const getAdminRole = () =>
  new Role({
    name: "admin",
    description: "Administrator",
    permissions: [],
  });

export const getCommonRole = () =>
  new Role({
    name: "common",
    description: "Common",
    permissions: [],
  });
