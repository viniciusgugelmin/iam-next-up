import Role from "../../back/models/Role";

const adminRole = new Role({
  name: "admin",
  description: "Administrator",
  permissions: [],
});

export default adminRole;
