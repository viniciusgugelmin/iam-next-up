import Role from "../../back/models/Role";

const commonRole = new Role({
  name: "common",
  description: "Common",
  permissions: [],
});

export default commonRole;
