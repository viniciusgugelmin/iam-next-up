import Permission from "../../back/models/Permission";

const permissions = [
  new Permission({
    name: "admin_users",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "users",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "customers",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "products",
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

export default permissions;
