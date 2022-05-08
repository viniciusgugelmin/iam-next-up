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
import { deleteProduct } from "../../../../front/requests/products/deleteProduct";
import { getProducts } from "../../../../front/requests/products/getProducts";
import IProduct from "../../../../interfaces/IProduct";

const ProductsList: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [products, setProducts] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = [
    "Name",
    "Brand",
    "Base price",
    "Price",
    "Quantity",
    "Category",
    "Update",
    "Delete",
  ];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Products list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products", "read")) {
      router.push("/home");
      return;
    }

    loadProducts();
  }, [isAuthenticated]);

  function loadProducts() {
    getProducts({ token: context.token })
      .then((data) => {
        const mappedProducts = data.products.map((product: IProduct) => [
          product.name,
          product.brand,
          product.basePrice,
          product.price,
          product.quantity,
          product.category?.name || "-",
          () => handleUpdateProduct(product._id as string),
          () => handleDeleteProduct(product._id as string, product.name),
        ]);

        setProducts([...mappedProducts]);
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
    router.push(`/home/products/form/${id}`);
  }

  function handleDeleteProduct(id: string, name: string) {
    dispatchConfirmBox({
      title: "Delete product",
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await deleteProduct({ id, token: context.token });

          dispatchAlert({
            message: `Product "${name}" has been deleted`,
            type: "success",
          });
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        } finally {
          loadProducts();
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
        title="Products list"
        headers={headers}
        data={products}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default ProductsList;
