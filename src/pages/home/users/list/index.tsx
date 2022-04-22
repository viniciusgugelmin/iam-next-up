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

const UsersList: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [users, setUsers] = useState<[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const headers = ["Name", "Email", "Role", "Update", "Delete"];
  const context = useContext(authContext);

  useEffect(() => {
    setPageSubtitle("Users list");

    if (!isAuthenticated) return;

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
          () => handleDeleteUser(user._id as string),
        ]);

        setUsers([...mappedUsers]);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(id: string) {
    console.log(id);
  }

  function handleDeleteUser(id: string) {
    console.log(id);
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
        isLoading={isLoading}
      />
    </HomeLoggedPage>
  );
};

export default UsersList;
