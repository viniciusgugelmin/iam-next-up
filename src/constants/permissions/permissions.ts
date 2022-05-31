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
    name: "costumers",
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
    name: "entries",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "product_categories",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "products_for_sale",
    create: true,
    read: true,
    update: true,
    delete: true,
  }),
  new Permission({
    name: "storage",
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
