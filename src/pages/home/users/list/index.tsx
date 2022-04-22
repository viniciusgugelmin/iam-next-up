import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import IPageProps from "../../../../interfaces/IPageProps";
import IUser from "../../../../interfaces/IUser";
import { Table } from "../../../../front/components/Base/Table";
import { getUsers } from "../../../../front/requests/users/getUsers";
import authContext from "../../../../front/stores/AuthContext";
import { dispatchConfirmBox } from "../../../../front/services/dispatchConfirmBox";
import { deleteUser } from "../../../../front/requests/users/deleteUser";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";

const UsersList: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [users, setUsers] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = ["Name", "Email", "Role", "Update", "Delete"];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Users list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "users", "read")) {
      router.push("/home");
      return;
    }

    loadUsers();
  }, [isAuthenticated]);

  function loadUsers() {
    getUsers({ token: context.token })
      .then((data) => {
        const mappedUsers = data.users.map((user: IUser) => [
          user.name,
          user.email,
          user.role.name,
          () => handleUpdateUser(user._id as string),
          () => handleDeleteUser(user._id as string, user.name),
        ]);

        setUsers([...mappedUsers]);
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
      .finally(() => setLoading(false));
  }

  function handleUpdateUser(id: string) {
    router.push(`/home/users/form/${id}`);
  }

  function handleDeleteUser(id: string, name: string) {
    dispatchConfirmBox({
      title: "Delete user",
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await deleteUser({ id, token: context.token });

          dispatchAlert({
            message: `User "${name}" has been deleted`,
            type: "success",
          });
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        } finally {
          loadUsers();
        }
      },
    });
  }

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <Table
        title="Users list"
        headers={headers}
        data={users}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default UsersList;
