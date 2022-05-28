import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import IPageProps from "../../../../interfaces/IPageProps";
import { Table } from "../../../../front/components/Base/Table";
import authContext from "../../../../front/stores/AuthContext";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";
import { getAllStorage } from "../../../../front/requests/storage/getAllStorage";

const StorageList: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [storage, setStorage] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = ["Name", "Liters"];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Storage list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "storage", "read")) {
      router.push("/home");
      return;
    }

    loadStorage();
  }, [isAuthenticated]);

  function loadStorage() {
    getAllStorage({ token: context.token })
      .then((data) => {
        const mappedProducts = data.products.map(
          (product: { _id: string; name: string; liters: Number }) => [
            product.name,
            product.liters,
            () => handleUpdateProduct(product._id as string),
          ]
        );

        setStorage([...mappedProducts]);
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

  function handleUpdateProduct(id: string) {
    router.push(`/home/storage/form/${id}`);
  }

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <Table
        title="Storage list"
        headers={headers}
        data={storage}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default StorageList;
