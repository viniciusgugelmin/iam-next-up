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
import { deleteEntry } from "../../../../front/requests/entries/deleteEntry";
import { getProductsForSale } from "../../../../front/requests/productsForSale/getProductsForSale";
import IProductForSale from "../../../../interfaces/models/IProductForSale";
import { deleteProductForSale } from "../../../../front/requests/productsForSale/deleteProductForSale";

const ProductsForSaleList: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [productsForSale, setProductsForSale] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = [
    "Product Id",
    "Product name",
    "Price per liter",
    "Storage liters",
    "Promo",
    "Created at",
    "Delete",
  ];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Products for sale list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products_for_sale", "read")) {
      router.push("/home");
      return;
    }

    loadProductsForSale();
  }, [isAuthenticated]);

  function loadProductsForSale() {
    getProductsForSale({ token: context.token })
      .then((data) => {
        const mappedProductsForSale = data.productsForSale.map(
          (productForSale: IProductForSale) => [
            productForSale.productId,
            productForSale.product?.name || "",
            formatReal(productForSale.pricePerLiter),
            formatLiters(productForSale.storageLiters || 0),
            // @ts-ignore
            formatPromo(productForSale._promo),
            // @ts-ignore
            formatDate(productForSale._createdAt),
            () =>
              handleDeleteProductForSale(
                productForSale._id as string,
                productForSale.product?.name as string
              ),
          ]
        );

        setProductsForSale([...mappedProductsForSale]);
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

  function formatPromo(value: number): string {
    return (
      Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value) + "%"
    );
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }

  function handleDeleteProductForSale(id: string, productName: string) {
    dispatchConfirmBox({
      title: "Delete product for sale",
      message: `Are you sure you want to delete "${
        productName || id
      }" product for sale?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await deleteProductForSale({ id, token: context.token });

          dispatchAlert({
            message: `Product for sale "${productName || id}" has been deleted`,
            type: "success",
          });
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        } finally {
          loadProductsForSale();
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
        title="Products for sale list"
        headers={headers}
        data={productsForSale}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default ProductsForSaleList;
