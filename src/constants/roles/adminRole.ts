import Role from "../../back/models/Role";

const adminRole = new Role({
  name: "admin",
  description: "Administrator",
  permissions: [],
  deletedAt: null,
});

export default adminRole;
