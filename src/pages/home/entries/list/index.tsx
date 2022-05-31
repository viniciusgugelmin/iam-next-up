import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../front/components/Base/PageLoading";
import useAuthentication from "../../../../front/hooks/UseAuthentication";
import IPageProps from "../../../../interfaces/IPageProps";
import { Table } from "../../../../front/components/Base/Table";
import authContext from "../../../../front/stores/AuthContext";
import { dispatchConfirmBox } from "../../../../front/services/dispatchConfirmBox";
import { dispatchAlert } from "../../../../front/services/dispatchAlert";
import { IError } from "../../../../interfaces/IError";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../../front/services/checkIfUserHasPermission";
import IEntry from "../../../../interfaces/models/IEntry";
import { getEntries } from "../../../../front/requests/entries/getEntries";
import { deleteEntry } from "../../../../front/requests/entries/deleteEntry";

const EntriesList: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [entries, setEntries] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = [
    "Product Id",
    "Product name",
    "Price",
    "Liters",
    "Created at",
    "Delete",
  ];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Entries list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "entries", "read")) {
      router.push("/home");
      return;
    }

    loadEntries();
  }, [isAuthenticated]);

  function loadEntries() {
    getEntries({ token: context.token })
      .then((data) => {
        const mappedEntries = data.entries.map((entry: IEntry) => [
          entry.productId,
          entry.product?.name || "",
          formatReal(entry.price),
          formatLiters(entry.liters),
          // @ts-ignore
          formatDate(entry._createdAt),
          () =>
            handleDeleteEntry(
              entry._id as string,
              entry.product?.name as string
            ),
        ]);

        setEntries([...mappedEntries]);
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

  function formatReal(value: number): string {
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatLiters(value: number): string {
    return Intl.NumberFormat("pt-BR", {
      style: "decimal",
    }).format(value);
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }

  function handleDeleteEntry(id: string, productName: string) {
    dispatchConfirmBox({
      title: "Delete entry",
      message: `Are you sure you want to delete "${productName || id}" entry?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await deleteEntry({ id, token: context.token });

          dispatchAlert({
            message: `Entry "${productName || id}" has been deleted`,
            type: "success",
          });
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        } finally {
          loadEntries();
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
        title="Entries list"
        headers={headers}
        data={entries}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default EntriesList;
