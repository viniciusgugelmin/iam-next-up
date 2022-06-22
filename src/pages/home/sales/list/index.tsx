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
import { getSales } from "../../../../front/requests/sales/getSales";
import ISale from "../../../../interfaces/models/ISale";

const SalesList: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [sales, setSales] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = ["Product name", "Customer name", "Liters", "Amount paid"];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Sales list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "sales", "read")) {
      router.push("/home");
      return;
    }

    loadSales();
  }, [isAuthenticated]);

  function loadSales() {
    getSales({ token: context.token })
      .then((data) => {
        const mappedSales = data.sales.map((sale: ISale) => [
          sale.product?.name ?? "-",
          sale.customer?.name ?? "-",
          formatLiters(sale.liters),
          sale.amountPaid ? formatReal(sale.amountPaid) : "-",
        ]);

        setSales([...mappedSales]);
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

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <Table
        title="Sales list"
        headers={headers}
        data={sales}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default SalesList;
