import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import IPageProps from "../../../../interfaces/IPageProps";
import IUser from "../../../../interfaces/models/IUser";
import { Table } from "../../../../front/components/Base/Table";
import { getUsers } from "../../../../front/requests/users/getUsers";
import authContext from "../../../../front/stores/AuthContext";
import { dispatchConfirmBox } from "../../../../front/services/dispatchConfirmBox";
import { deleteUser } from "../../../../front/requests/users/deleteUser";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";
import IRole from "../../../../interfaces/models/IRole";
import { getRoles } from "../../../../front/requests/roles/getRoles";

const RolesList: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [roles, setRoles] = useState<[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const headers = ["Name"];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Roles list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "roles", "read")) {
      router.push("/home");
      return;
    }

    loadRoles();
  }, [isAuthenticated]);

  function loadRoles() {
    getRoles({ token: context.token })
      .then((data) => {
        const mappedRoles = data.roles.map((role: IRole) => [role.name]);

        setRoles([...mappedRoles]);
      })
      .catch((error) => {
        if (!error.response?.data) {
          dispatchAlert({
            message: "Server error",
            type: "error",
          });
        } else {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <Table
        title="Roles list"
        headers={headers}
        data={roles}
        isLoading={isLoading}
      />
    </HomeLoggedPage>
  );
};

export default RolesList;
