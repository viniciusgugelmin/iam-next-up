import adminRole from "../../constants/roles/adminRole";
import { dispatchAlert } from "./dispatchAlert";

export const checkIfHasPermission = (
  user: any,
  permissionName: string,
  permissionValue: string,
  dispatch: boolean = true
) => {
  if (
    user.role.name === adminRole.name ||
    user.role.permissions?.find(
      // @ts-ignore
      (permission) =>
        // @ts-ignore
        permission.name === permissionName && permission[permissionValue]
    )
  )
    return true;

  if (dispatch) {
    dispatchAlert({
      type: "error",
      message: "You don't have permission",
    });
  }

  return false;
};
