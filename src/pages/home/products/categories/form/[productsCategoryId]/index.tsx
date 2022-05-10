import { NextPage } from "next";
import { HomeLoggedPage } from "../../../../../../front/components/Template/Home/HomeLoggedPage";
import { FormEvent, useContext, useEffect, useState } from "react";
import { checkIfHasPermission } from "../../../../../../front/services/checkIfUserHasPermission";
import useAuthentication from "../../../../../../front/hooks/UseAuthentication";
import authContext from "../../../../../../front/stores/AuthContext";
import { useRouter } from "next/router";
import IPageProps from "../../../../../../interfaces/IPageProps";
import { dispatchAlert } from "../../../../../../front/services/dispatchAlert";
import { IError } from "../../../../../../interfaces/IError";
import { PageLoading } from "../../../../../../front/components/Base/PageLoading";
import { Form } from "../../../../../../front/components/Base/Form";
import { Input } from "../../../../../../front/components/Base/Input";
import { Button } from "../../../../../../front/components/Base/Button";
import { getProductsCategory } from "../../../../../../front/requests/productsCategories/getProductsCategory";
import { putProductsCategory } from "../../../../../../front/requests/productsCategories/putProductsCategory";

const ProductsCategoryUpdateForm: NextPage<IPageProps> = ({
  setPageSubtitle,
}: IPageProps) => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuthentication();
  const context = useContext(authContext);
  const router = useRouter();
  const color = "purple";

  const [name, setName] = useState("");

  const isFormFilled = name;

  useEffect(() => {
    setPageSubtitle("Products categories form");

    if (!isAuthenticated) return;

    if (!checkIfHasPermission(context.user, "products_cateogories", "update")) {
      router.push("/home");
    }

    loadProductsCategory();
  }, [isAuthenticated]);

  function loadProductsCategory() {
    getProductsCategory({
      token: context.token,
      id: router.query.productsCategoryId as string,
    }).then((data) => {
      setName(data.productsCategory.name);
    });
  }

  async function updateProductsCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormFilled || loading) return;

    setLoading(true);

    try {
      await putProductsCategory({
        token: context.token,
        productsCategory: {
          name,
        },
        id: router.query.productsCategoryId as string,
      });

      dispatchAlert({
        message: "Products category updated successful",
        type: "success",
      });

      router.push("/home/products/categories/list");
    } catch (error) {
      // @ts-ignore
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
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <Form
        className="up-form up-admin-form"
        onSubmit={updateProductsCategory}
        color={color}
        title="Update products category"
      >
        <Input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          color={color}
          required
        />
        <Button type="submit" color={color} disabled={!isFormFilled || loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </Form>
    </HomeLoggedPage>
  );
};

export default ProductsCategoryUpdateForm;
