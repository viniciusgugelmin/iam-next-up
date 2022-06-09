import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import IPageProps from "../../../../interfaces/IPageProps";
import { Table } from "../../../../front/components/Base/Table";
import { getUsers } from "../../../../front/requests/users/getUsers";
import authContext from "../../../../front/stores/AuthContext";
import { dispatchConfirmBox } from "../../../../front/services/dispatchConfirmBox";
import { deleteUser } from "../../../../front/requests/users/deleteUser";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";
import ICustomer from "../../../../interfaces/models/ICustomer";
import { getCustomers } from "../../../../front/requests/customers/getCustomers";
import { deleteCustomer } from "../../../../front/requests/customers/deleteCustomer";

const CustomersList: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [customers, setCustomers] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = ["Name", "Email", "Update", "Delete"];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Customers list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "customers", "read")) {
      router.push("/home");
      return;
    }

    loadCustomers();
  }, [isAuthenticated]);

  function loadCustomers() {
    getCustomers({ token: context.token })
      .then((data) => {
        const mappedCustomers = data.customers.map((customer: ICustomer) => [
          customer.name,
          customer.email,
          () => handleUpdateCustomer(customer._id as string),
          () => handleDeleteCustomer(customer._id as string, customer.name),
        ]);

        setCustomers([...mappedCustomers]);
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

  function handleUpdateCustomer(id: string) {
    router.push(`/home/customers/form/${id}`);
  }

  function handleDeleteCustomer(id: string, name: string) {
    dispatchConfirmBox({
      title: "Delete customer",
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await deleteCustomer({ id, token: context.token });

          dispatchAlert({
            message: `Customer "${name}" has been deleted`,
            type: "success",
          });
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        } finally {
          loadCustomers();
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
        title="Customers list"
        headers={headers}
        data={customers}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default CustomersList;
