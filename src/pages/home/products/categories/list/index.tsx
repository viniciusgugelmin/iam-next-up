import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../../front/components/Template/Home/HomeLoggedPage";
import { useContext, useEffect, useState } from "react";
import { PageLoading } from "../../../../../front/components/Base/PageLoading";
import useAuthentication from "../../../../../front/hooks/UseAuthentication";
import IPageProps from "../../../../../interfaces/IPageProps";
import { Table } from "../../../../../front/components/Base/Table";
import authContext from "../../../../../front/stores/AuthContext";
import { dispatchConfirmBox } from "../../../../../front/services/dispatchConfirmBox";
import { dispatchAlert } from "../../../../../front/services/dispatchAlert";
import { IError } from "../../../../../interfaces/IError";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../../../front/services/checkIfUserHasPermission";
import IProductsCategory from "../../../../../interfaces/models/IProductsCategory";
import { getProductsCategories } from "../../../../../front/requests/productsCategories/getProductsCategories";
import { deleteProductsCategory } from "../../../../../front/requests/productsCategories/deleteProductsCategory";

const ProductsCategoriesList: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const [categories, setCategories] = useState<[][]>([]);
  const [loading, setLoading] = useState(true);
  const headers = ["Name", "Update", "Delete"];
  const context = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    setPageSubtitle("Products categories list");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products_categories", "read")) {
      router.push("/home");
      return;
    }

    loadProductsCategories();
  }, [isAuthenticated]);

  function loadProductsCategories() {
    getProductsCategories({ token: context.token })
      .then((data) => {
        const mappedCategories = data.productsCategories.map(
          (category: IProductsCategory) => [
            category.name,
            () => handleUpdateCategory(category._id as string),
            () => handleDeleteCategory(category._id as string, category.name),
          ]
        );

        setCategories([...mappedCategories]);
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

  function handleUpdateCategory(id: string) {
    router.push(`/home/products/categories/form/${id}`);
  }

  function handleDeleteCategory(id: string, name: string) {
    dispatchConfirmBox({
      title: "Delete products category",
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await deleteProductsCategory({ id, token: context.token });

          dispatchAlert({
            message: `Products category "${name}" has been deleted`,
            type: "success",
          });
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        } finally {
          loadProductsCategories();
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
        title="Products categories list"
        headers={headers}
        data={categories}
        isLoading={loading}
      />
    </HomeLoggedPage>
  );
};

export default ProductsCategoriesList;
